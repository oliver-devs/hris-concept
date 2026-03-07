import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0008_add_department_to_position"),
    ]

    operations = [
        migrations.AlterField(
            model_name="position",
            name="department",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="positions",
                to="api.department",
            ),
        ),
    ]
