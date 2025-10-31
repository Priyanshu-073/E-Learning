from django.shortcuts import redirect
from django.urls import reverse_lazy
from django.views import generic
from django.shortcuts import render
from .models import Course, Instructor, Participant
from .forms import CourseForm
from django.shortcuts import get_object_or_404
from django.http import HttpResponseForbidden
from .models import Test, Question, Choice, StudentSubmission, SubmissionAnswer
from django.utils import timezone
from django import forms
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib.auth import login, authenticate
from django.contrib.auth.decorators import login_required
from .forms import SignupForm
from django.shortcuts import HttpResponse
from django.db.models import Count
from .models import ProblemReport


class TakeTestForm(forms.Form):
    # dynamic form created in view
    pass



class StaffRequiredMixin(LoginRequiredMixin, UserPassesTestMixin):
    """Mixin to restrict access to staff users only."""

    def test_func(self):
        return bool(self.request.user and self.request.user.is_staff)


def index(request):
    # Landing behavior: send everyone to the signup (landing) page per request.
    return redirect('programs:signup')

class CourseListView(generic.ListView):
    model = Course
    template_name = 'programs/course_list.html'
    context_object_name = 'courses'


class CourseDetailView(generic.DetailView):
    model = Course
    template_name = 'programs/course_detail.html'


class CourseCreateView(StaffRequiredMixin, generic.CreateView):
    model = Course
    form_class = CourseForm
    template_name = 'programs/course_form.html'
    success_url = reverse_lazy('programs:course_list')


class CourseUpdateView(StaffRequiredMixin, generic.UpdateView):
    model = Course
    form_class = CourseForm
    template_name = 'programs/course_form.html'
    success_url = reverse_lazy('programs:course_list')


class CourseDeleteView(StaffRequiredMixin, generic.DeleteView):
    model = Course
    template_name = 'programs/course_confirm_delete.html'
    success_url = reverse_lazy('programs:course_list')


class InstructorListView(generic.ListView):
    model = Instructor
    template_name = 'programs/instructor_list.html'
    context_object_name = 'instructors'


class ParticipantListView(generic.ListView):
    model = Participant
    template_name = 'programs/participant_list.html'
    context_object_name = 'participants'


class InstructorCreateView(StaffRequiredMixin, generic.CreateView):
    model = Instructor
    fields = ['name', 'bio']
    template_name = 'programs/instructor_form.html'
    success_url = reverse_lazy('programs:instructor_list')


class InstructorUpdateView(StaffRequiredMixin, generic.UpdateView):
    model = Instructor
    fields = ['name', 'bio']
    template_name = 'programs/instructor_form.html'
    success_url = reverse_lazy('programs:instructor_list')


class InstructorDeleteView(StaffRequiredMixin, generic.DeleteView):
    model = Instructor
    template_name = 'programs/instructor_confirm_delete.html'
    success_url = reverse_lazy('programs:instructor_list')


class ParticipantCreateView(StaffRequiredMixin, generic.CreateView):
    model = Participant
    fields = ['name', 'email', 'organization']
    template_name = 'programs/participant_form.html'
    success_url = reverse_lazy('programs:participant_list')


class ParticipantUpdateView(StaffRequiredMixin, generic.UpdateView):
    model = Participant
    fields = ['name', 'email', 'organization']
    template_name = 'programs/participant_form.html'
    success_url = reverse_lazy('programs:participant_list')


class ParticipantDeleteView(StaffRequiredMixin, generic.DeleteView):
    model = Participant
    template_name = 'programs/participant_confirm_delete.html'
    success_url = reverse_lazy('programs:participant_list')


def remove_participant_from_course(request, course_pk, participant_pk):
    # Only allow POST to modify data
    if request.method != 'POST':
        return HttpResponseForbidden('POST required')
    course = get_object_or_404(Course, pk=course_pk)
    participant = get_object_or_404(Participant, pk=participant_pk)
    course.participants.remove(participant)
    return redirect('programs:course_detail', pk=course_pk)


class TestListView(generic.ListView):
    model = Test
    template_name = 'programs/test_list.html'
    context_object_name = 'tests'


class TestDetailView(generic.DetailView):
    model = Test
    template_name = 'programs/test_detail.html'


class AttemptedTestsListView(LoginRequiredMixin, generic.ListView):
    """List submissions (attempted tests). Staff see all submissions; regular users see their own."""
    model = StudentSubmission
    template_name = 'programs/attempted_tests.html'
    context_object_name = 'submissions'

    def get_queryset(self):
        qs = super().get_queryset().select_related('test', 'user', 'participant')
        if self.request.user.is_staff:
            return qs.order_by('-submitted_at')
        # regular user: show submissions tied to the authenticated user
        return qs.filter(user=self.request.user).order_by('-submitted_at')


def take_test(request, pk):
    test = get_object_or_404(Test, pk=pk)

    # If user is authenticated, associate submission with user.
    user = request.user if request.user.is_authenticated else None

    # For anonymous users, let them pick an existing Participant from a list.
    participant = None
    if not user:
        # If a participant was posted (user selected), respect that.
        if request.method == 'POST':
            participant_id = request.POST.get('participant_id')
            if participant_id:
                try:
                    participant = Participant.objects.get(pk=int(participant_id))
                except Participant.DoesNotExist:
                    participant = None
        # if still None, fall back to first participant for demo (or show message later)
        if participant is None:
            participant = Participant.objects.first()

    if not user and participant is None:
        return HttpResponseForbidden('No participant available. Create a participant first or log in.')

    questions = list(test.questions.prefetch_related('choices'))

    if request.method == 'POST':
        # grade: count correct choices
        total = len(questions)
        correct = 0
        submission = StudentSubmission.objects.create(
            test=test,
            participant=participant if not user else None,
            user=user,
            submitted_at=timezone.now(),
        )
        for q in questions:
            choice_id = request.POST.get(f'question_{q.pk}')
            if not choice_id:
                continue
            try:
                choice = Choice.objects.get(pk=int(choice_id), question=q)
            except Choice.DoesNotExist:
                continue
            SubmissionAnswer.objects.create(submission=submission, question=q, choice=choice)
            if choice.is_correct:
                correct += 1
        score = (correct / total) * 100 if total else 0
        submission.score = score
        submission.save()
        return redirect('programs:test_result', pk=test.pk, submission_pk=submission.pk)

    # GET: build a simple context. For anonymous users expose list of participants to choose from.
    context = {'test': test, 'questions': questions, 'taking': True}
    if not user:
        context['participants'] = Participant.objects.all()
    return render(request, 'programs/test_detail.html', context)


def test_result(request, pk, submission_pk):
    submission = get_object_or_404(StudentSubmission, pk=submission_pk, test_id=pk)
    student_display = None
    student_reg = None
    if submission.user:
        user = submission.user
        student_display = user.get_full_name() or user.get_username()
        profile = getattr(user, 'studentprofile', None)
        if profile:
            student_reg = profile.reg_no
    return render(request, 'programs/test_result.html', {'submission': submission, 'student_display': student_display, 'student_reg': student_reg})


def signup(request):
    if request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            user = form.save()
            # create a StudentProfile automatically (model save handles reg_no)
            try:
                # import here to avoid circular
                from .models import StudentProfile
                StudentProfile.objects.create(user=user)
            except Exception:
                pass
            # authenticate and login
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            if user:
                login(request, user)
            return redirect('programs:course_list')
    else:
        form = SignupForm()
    return render(request, 'registration/signup.html', {'form': form})


@login_required
def profile(request):
    # show user's profile and reg no
    profile = None
    try:
        profile = request.user.studentprofile
    except Exception:
        profile = None
    return render(request, 'programs/profile.html', {'profile': profile})


@login_required
def dashboard(request):
    user = request.user
    # Courses where the user is a linked Participant
    courses_enrolled = Course.objects.none()
    try:
        # If participant linked
        participant = getattr(user, 'participant_profile', None)
        if participant is not None:
            courses_enrolled = Course.objects.filter(participants=participant)
        else:
            # fallback: courses where Participant.user == user
            courses_enrolled = Course.objects.filter(participants__user=user)
    except Exception:
        courses_enrolled = Course.objects.filter(participants__user=user)

    # Count courses per instructor
    instructor_progress = courses_enrolled.values('instructor__name').annotate(lectures_attended=Count('pk'))

    tests_attempted = StudentSubmission.objects.filter(user=user).count()

    report_submitted = False
    if request.method == 'POST':
        subject = request.POST.get('subject', '').strip()
        message = request.POST.get('message', '').strip()
        if subject and message:
            ProblemReport.objects.create(user=user, subject=subject, message=message)
            report_submitted = True

    context = {
        'instructor_progress': instructor_progress,
        'tests_attempted': tests_attempted,
        'report_submitted': report_submitted,
    }
    return render(request, 'programs/dashboard.html', context)
