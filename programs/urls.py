from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

app_name = 'programs'

urlpatterns = [
    path('', views.index, name='index'),
    path('courses/', views.CourseListView.as_view(), name='course_list'),
    path('courses/add/', views.CourseCreateView.as_view(), name='course_add'),
    path('courses/<int:pk>/', views.CourseDetailView.as_view(), name='course_detail'),
    path('courses/<int:pk>/edit/', views.CourseUpdateView.as_view(), name='course_edit'),
    path('courses/<int:pk>/delete/', views.CourseDeleteView.as_view(), name='course_delete'),
    path('instructors/', views.InstructorListView.as_view(), name='instructor_list'),
    path('instructors/add/', views.InstructorCreateView.as_view(), name='instructor_add'),
    path('instructors/<int:pk>/edit/', views.InstructorUpdateView.as_view(), name='instructor_edit'),
    path('instructors/<int:pk>/delete/', views.InstructorDeleteView.as_view(), name='instructor_delete'),
    path('participants/', views.ParticipantListView.as_view(), name='participant_list'),
    path('participants/add/', views.ParticipantCreateView.as_view(), name='participant_add'),
    path('participants/<int:pk>/edit/', views.ParticipantUpdateView.as_view(), name='participant_edit'),
    path('participants/<int:pk>/delete/', views.ParticipantDeleteView.as_view(), name='participant_delete'),
    path('courses/<int:course_pk>/participants/<int:participant_pk>/remove/', views.remove_participant_from_course, name='remove_participant'),
    # Test section
    path('tests/', views.TestListView.as_view(), name='test_list'),
    path('tests/<int:pk>/', views.TestDetailView.as_view(), name='test_detail'),
    path('tests/<int:pk>/take/', views.take_test, name='take_test'),
    path('tests/<int:pk>/result/<int:submission_pk>/', views.test_result, name='test_result'),
    path('tests/attempted/', views.AttemptedTestsListView.as_view(), name='attempted_tests'),
    path('accounts/signup/', views.signup, name='signup'),
    path('accounts/profile/', views.profile, name='profile'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('accounts/login/', auth_views.LoginView.as_view(template_name='registration/login.html'), name='login'),
    path('accounts/logout/', auth_views.LogoutView.as_view(template_name='registration/logged_out.html'), name='logout'),
]
