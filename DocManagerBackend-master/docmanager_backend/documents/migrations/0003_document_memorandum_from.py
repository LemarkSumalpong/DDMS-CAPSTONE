# Generated by Django 5.1.3 on 2025-01-08 04:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("documents", "0002_alter_document_document_type"),
    ]

    operations = [
        migrations.AddField(
            model_name="document",
            name="memorandum_from",
            field=models.CharField(blank=True, max_length=128, null=True),
        ),
    ]
