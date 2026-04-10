import click
from api.models import db, User, Activity, categoryActivity

"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are usefull to run cronjobs or tasks outside of the API but sill in integration 
with youy database, for example: Import the price of bitcoin every night as 12am
"""

DEMO_ACTIVITY_IMAGE = "https://res.cloudinary.com/dzvcmydip/image/upload/v1775696643/img_prueba_actividad_ddyuzy.jpg"
CATEGORY_SAMPLE_CONFIG = {
    categoryActivity.DRABBLES: ("DR", "Drabbles"),
    categoryActivity.NON_SEX: ("NS", "Non Sex"),
    categoryActivity.QUOTES: ("QU", "Quotes"),
    categoryActivity.SENSIBLE_CONTENT: ("SE", "Sensible Content"),
    categoryActivity.EXPLICIT: ("EX", "Explicit"),
    categoryActivity.AGNUS_DEI: ("AG", "Agnus Dei"),
    categoryActivity.SPECIAL: ("SP", "Special"),
    categoryActivity.RECORDIS: ("RE", "Recordis"),
    categoryActivity.GALLERY: ("GA", "Gallery"),
    categoryActivity.MUSIC: ("MU", "Music"),
}


def build_demo_description(category_label, index):
    return (
        f"{category_label} de ejemplo #{index}. "
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
        "Praesent commodo, nibh a efficitur gravida, justo velit semper lorem, "
        "eget accumsan massa urna sed augue. Sed vitae sapien sed nibh iaculis "
        "interdum, congue justo non, eleifend massa. Curabitur ut est in erat "
        "vehicula tincidunt."
    )


def setup_commands(app):
    """ 
    This is an example command "insert-test-users" that you can run from the command line
    by typing: $ flask insert-test-users 5
    Note: 5 is the number of users to add
    """
    @app.cli.command("insert-test-users")  # name of our command
    @click.argument("count")  # argument of out command
    def insert_test_users(count):
        print("Creating test users")
        for x in range(1, int(count) + 1):
            user = User()
            user.email = "test_user" + str(x) + "@test.com"
            user.password = "123456"
            user.is_active = True
            db.session.add(user)
            db.session.commit()
            print("User: ", user.email, " created.")

        print("All test users created")

    @app.cli.command("insert-test-data")
    @click.option("--count-per-category", default=24, show_default=True, type=int)
    def insert_test_data(count_per_category):
        if count_per_category < 1:
            raise click.BadParameter(
                "count-per-category must be greater than 0")

        click.echo("Creating demo activities...")
        created_total = 0

        for category, (prefix, label) in CATEGORY_SAMPLE_CONFIG.items():
            created_for_category = 0

            for index in range(1, count_per_category + 1):
                code = f"{prefix}-{index:03d}"
                existing_activity = Activity.query.filter_by(code=code).first()

                if existing_activity:
                    continue

                activity = Activity(
                    name=f"{label} Ejemplo {index}",
                    category=category,
                    description=build_demo_description(label, index),
                    image=DEMO_ACTIVITY_IMAGE,
                    code=code,
                )
                db.session.add(activity)
                created_for_category += 1
                created_total += 1

            click.echo(
                f"{label}: {created_for_category} actividades agregadas")

        db.session.commit()
        click.echo(
            f"Proceso finalizado. Total de actividades creadas: {created_total}")
