from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('programs', '0002_question_choice_studentsubmission_submissionanswer_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='studentsubmission',
            name='user',
            field=models.ForeignKey(
                to=settings.AUTH_USER_MODEL,
                null=True,
                blank=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='submissions',
            ),
        ),
    ]
