from django import forms
from .models import Course, Instructor, Participant
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import get_user_model

User = get_user_model()


class CourseForm(forms.ModelForm):
    class Meta:
        model = Course
        fields = ['title', 'description', 'start_date', 'duration_weeks', 'instructor', 'participants']


class InstructorForm(forms.ModelForm):
    class Meta:
        model = Instructor
        fields = ['name', 'bio']


class ParticipantForm(forms.ModelForm):
    class Meta:
        model = Participant
        fields = ['name', 'email', 'organization']


class SignupForm(UserCreationForm):
    email = forms.EmailField(required=False)
    first_name = forms.CharField(required=False)
    last_name = forms.CharField(required=False)

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password1', 'password2')
        widgets = {
            'username': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Username'}),
            'first_name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'First Name'}),
            'last_name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Last Name'}),
            'email': forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Email'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # style password fields
        pw_attrs = {'class': 'form-control password-field', 'placeholder': 'Password'}
        pw2_attrs = {'class': 'form-control password-field', 'placeholder': 'Confirm Password'}
        if 'password1' in self.fields:
            self.fields['password1'].widget = forms.PasswordInput(attrs=pw_attrs)
        if 'password2' in self.fields:
            self.fields['password2'].widget = forms.PasswordInput(attrs=pw2_attrs)
