from django.contrib import admin
from .models import Course, Instructor, Participant


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'instructor', 'start_date', 'duration_weeks')
    list_filter = ('start_date', 'duration_weeks')
    search_fields = ('title', 'description')


@admin.register(Instructor)
class InstructorAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(Participant)
class ParticipantAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'organization')
    search_fields = ('name', 'email', 'organization')


from .models import Test, Question, Choice, StudentSubmission, SubmissionAnswer
from .models import StudentProfile
from .models import ProblemReport


@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'start_date', 'duration_minutes')
    list_filter = ('start_date', 'course')


class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 2


class QuestionAdmin(admin.ModelAdmin):
    inlines = [ChoiceInline]
    list_display = ('text', 'test')


@admin.register(Question)
class _QuestionAdmin(QuestionAdmin):
    pass


@admin.register(Choice)
class _ChoiceAdmin(admin.ModelAdmin):
    list_display = ('text', 'question', 'is_correct')


@admin.register(StudentSubmission)
class StudentSubmissionAdmin(admin.ModelAdmin):
    list_display = ('test', 'participant', 'score', 'submitted_at')


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'reg_no', 'created_at')


@admin.register(ProblemReport)
class ProblemReportAdmin(admin.ModelAdmin):
    list_display = ('user', 'subject', 'created_at', 'resolved')
    list_filter = ('resolved', 'created_at')


@admin.register(SubmissionAnswer)
class SubmissionAnswerAdmin(admin.ModelAdmin):
    list_display = ('submission', 'question', 'choice')
