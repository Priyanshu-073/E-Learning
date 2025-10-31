from django.db import models
from django.utils import timezone
from django.conf import settings
import uuid


class Instructor(models.Model):
    name = models.CharField(max_length=200)
    bio = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Participant(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField(blank=True)
    organization = models.CharField(max_length=200, blank=True)
    # optional link to auth user (when a participant has a user account)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name='participant_profile')

    def create_reg_no(self):
        # generate a short unique registration number
        return 'R' + uuid.uuid4().hex[:10].upper()

    def save(self, *args, **kwargs):
        # ensure a reg_no-like field exists on the participant via user if provided
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


# Optional student profile linked to Django user. Stores a unique registration number.
class StudentProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='studentprofile')
    reg_no = models.CharField(max_length=32, unique=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.reg_no:
            self.reg_no = 'R' + uuid.uuid4().hex[:10].upper()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.get_username()} ({self.reg_no})"


class ProblemReport(models.Model):
    """Simple model to collect problem reports from students."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name='problem_reports')
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    resolved = models.BooleanField(default=False)

    def __str__(self):
        return f"Report #{self.pk} - {self.subject}" 


class Course(models.Model):
    """A course or program for remedial teaching and capacity building."""
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    start_date = models.DateField(null=True, blank=True)
    duration_weeks = models.PositiveIntegerField(default=0)
    instructor = models.ForeignKey(Instructor, null=True, blank=True, on_delete=models.SET_NULL, related_name='courses')
    participants = models.ManyToManyField(Participant, blank=True, related_name='courses')

    def __str__(self):
        return self.title


class Test(models.Model):
    """A test/quiz associated with a course."""
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='tests')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    start_date = models.DateTimeField(null=True, blank=True)
    duration_minutes = models.PositiveIntegerField(default=30)

    def __str__(self):
        return f"{self.course}: {self.title}"


class Question(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()

    def __str__(self):
        return self.text[:80]


class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='choices')
    text = models.CharField(max_length=500)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.text[:80]


class StudentSubmission(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='submissions')
    # Link to a registered user when available
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name='submissions')
    # Keep participant for anonymous/legacy use
    participant = models.ForeignKey('Participant', null=True, blank=True, on_delete=models.SET_NULL, related_name='submissions')
    score = models.FloatField(null=True, blank=True)
    submitted_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Submission {self.pk} - {self.participant} - {self.test}"


class SubmissionAnswer(models.Model):
    submission = models.ForeignKey(StudentSubmission, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice = models.ForeignKey(Choice, on_delete=models.CASCADE)

    def __str__(self):
        return f"Answer {self.pk} for {self.submission}"
