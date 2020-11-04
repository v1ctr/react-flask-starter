## Create Python Environment
    $ cd server
    $ python3 -m venv venv
    $ source venv/bin/activate
    (venv) $ _

## Database Migration with Flask-Migrate

### Create a Migration Script
    $ flask db migrate -m "migration message"
    
### Upgrading the Database
    $ flask db upgrade

## Flask Python Shell

### Start Flask Shell
    $ flask shell

### Exit Flask Shell
    $ exit()
    
### Creating/Removing tables
Use with caution. All data in database will be lost.

    $ db.create_all()
    $ db.drop_all()
    
### Creating Users
    $ user = User("test@gmail.com")
    $ db.session.add(user)
    $ db.session.commit()

### Querying Users
Get all users

    $ User.query.all()

Get specific user

    $ User.query.filter_by(email="test@gmail.com").first()

Get native SQL query that SQLAlchemy generates
    
    $ str(User.query.filter_by(email="test@gmail.com"))

## Sending Emails

### Start Flask Shell 
    export MAIL_USERNAME=<Gmail username>
    export MAIL_PASSWORD=<Gmail password>
    export MAIL_DEFAULT_SENDER=<Gmail mail adress>
    flask shell
    
To display the name as the sender you can set ```MAIL_DEFAULT_USER='User <user@example.com>'```

### Sending Email
    from app.email import send_email
    send_email('you@example.com', 'Subject', 'email')

If you're using Gmail, make sure you allow less secure apps: [https://myaccount.google.com/lesssecureapps](https://myaccount.google.com/lesssecureapps)

## Testing
### Unit Tests
    $ flask test

### Code Coverage
Code coverage tools measure how much of the application is excercised by unit tests. (Grinberg. M, 2018, Flask Web Development, O'REILLY)

    $ flask test --coverage

## Deploying

### Docker
Building the Container Image

```bash
docker build -t flask-backend:latest .
```

Running the Container

```bash
docker run --rm --name flask-backend -d -p 8000:5000 -e SECRET_KEY=secret_key flask-backend:latest
```

If you get a permission denied error for ```boot.sh``` than change permissions:

```bash
chmod +x boot.sh
```

Stopping the Container

```bash
docker stop flask-backend
```

Deleting the Container

```bash
docker rm flask-backend
```

## References
* Grinberg. M, 2018, Flask Web Development, O'REILLY
* [https://github.com/sendgrid/email-templates](https://github.com/sendgrid/email-templates)