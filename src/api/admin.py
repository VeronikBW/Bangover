import os
import inspect
from flask_admin import Admin
from . import models
from .models import db
from flask_admin.contrib.sqla import ModelView
from flask_admin.theme import Bootstrap4Theme
from werkzeug.security import generate_password_hash


class SecureModelView(ModelView):
    def on_model_change(self, form, model, is_created):
        if isinstance(model, models.User):
            password = getattr(form.password, 'data', None)
            if password and not str(password).startswith(('scrypt:', 'pbkdf2:')):
                model.password = generate_password_hash(password)
        return super().on_model_change(form, model, is_created)


def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    admin = Admin(app, name='4Geeks Admin',
                  theme=Bootstrap4Theme(swatch='cerulean'))

    # Dynamically add all models to the admin interface
    for name, obj in inspect.getmembers(models):
        # Verify that the object is a SQLAlchemy model before adding it to the admin.
        if inspect.isclass(obj) and issubclass(obj, db.Model):
            admin.add_view(SecureModelView(obj, db.session))
