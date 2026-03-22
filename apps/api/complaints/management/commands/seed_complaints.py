"""Management command to seed the database with complaints.json."""
import json
import uuid
from pathlib import Path
from django.core.management.base import BaseCommand
from django.utils.dateparse import parse_datetime

from complaints.models import Complaint

# complaints/management/commands/seed_complaints.py → go up 5 levels to project root
COMPLAINTS_JSON = Path(__file__).resolve().parents[5] / "complaints.json"


class Command(BaseCommand):
    help = "Seed the database with complaints from complaints.json"

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Print what would be created without saving",
        )
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Clear existing complaints before seeding",
        )

    def handle(self, *args, **options):
        if not COMPLAINTS_JSON.exists():
            self.stderr.write(f"Could not find complaints.json at {COMPLAINTS_JSON}")
            return

        with open(COMPLAINTS_JSON) as f:
            data = json.load(f)

        if options["clear"] and not options["dry_run"]:
            Complaint.objects.all().delete()
            self.stdout.write(self.style.WARNING("Cleared existing complaints."))

        created = 0
        skipped = 0

        for item in data:
            raw_id = item["id"]
            try:
                complaint_id = uuid.UUID(raw_id)
            except ValueError:
                # Some fabricated IDs have invalid hex chars; derive a stable UUID
                complaint_id = uuid.uuid5(uuid.NAMESPACE_OID, raw_id)


            if options["dry_run"]:
                self.stdout.write(f"[DRY RUN] Would create: {item['customer_name']} — {item['channel']}")
                created += 1
                continue

            _, was_created = Complaint.objects.get_or_create(
                id=complaint_id,
                defaults={
                    "customer_name": item["customer_name"],
                    "timestamp": parse_datetime(item["timestamp"]),
                    "channel": item["channel"],
                    "account_type": item["account_type"],
                    "raw_text": item["raw_text"],
                    "actual_priority": item["actual_priority"],
                    "status": "Open",
                },
            )
            if was_created:
                created += 1
            else:
                skipped += 1

        if options["dry_run"]:
            self.stdout.write(self.style.SUCCESS(f"[DRY RUN] Would create {created} complaints."))
        else:
            self.stdout.write(self.style.SUCCESS(f"Seeded {created} complaints. Skipped {skipped} existing."))
