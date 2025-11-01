from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('programs', '0008_alter_problemreport_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='instructor',
            name='video_url',
            field=models.URLField(blank=True),
        ),
    ]
