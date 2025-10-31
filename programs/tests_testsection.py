from django.test import TestCase
from programs.models import Course, Instructor, Participant, Test, Question, Choice


class TestSectionTest(TestCase):
    def setUp(self):
        instr = Instructor.objects.create(name='Instr')
        course = Course.objects.create(title='Course A', duration_weeks=2, instructor=instr)
        self.participant = Participant.objects.create(name='Student')
        self.test = Test.objects.create(course=course, title='Quick Quiz')
        q1 = Question.objects.create(test=self.test, text='2+2')
        Choice.objects.create(question=q1, text='3', is_correct=False)
        Choice.objects.create(question=q1, text='4', is_correct=True)

    def test_grading(self):
        # simulate a POST to the take_test view via client
        q = self.test.questions.first()
        choice = q.choices.filter(is_correct=True).first()
        resp = self.client.post(f'/tests/{self.test.pk}/take/', {f'question_{q.pk}': str(choice.pk)})
        # should redirect to result
        self.assertEqual(resp.status_code, 302)