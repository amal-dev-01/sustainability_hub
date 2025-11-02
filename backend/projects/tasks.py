from celery import shared_task
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from projects.models import Task

@shared_task
def mark_overdue_tasks():
    """
    Periodic Celery task to mark overdue tasks and notify contributors.
    Runs daily and marks tasks as overdue if past due_date.
    """
    today = timezone.now().date()
    
    overdue_tasks = Task.objects.filter(is_completed=False, due_date__lt=today)
    updated_count = overdue_tasks.update(is_overdue=True)

    Task.objects.filter(is_completed=True).update(is_overdue=False)
    Task.objects.filter(due_date__gte=today).update(is_overdue=False)

    overdue_tasks = (
        Task.objects.filter(is_overdue=True)
        .prefetch_related("assigned_to__user")
        .select_related("project")
    )

    notified_emails = set()  
    for task in overdue_tasks:
        for contributor in task.assigned_to.all():
            user = contributor.user
            if user.email and user.email not in notified_emails:
                send_mail(
                    subject=f"Overdue Task Alert: {task.title}",
                    message=(
                        f"Dear {user.name},\n\n"
                        f"The task '{task.title}' under project '{task.project.name}' "
                        f"is overdue since {task.due_date}.\n"
                        f"Please take necessary action.\n\n"
                        f"Best regards,\nYour Task Management System"
                    ),
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                    fail_silently=True,
                )
                notified_emails.add(user.email)

    return f"{updated_count} tasks marked overdue on {today}, emails sent to {len(notified_emails)} contributors."


