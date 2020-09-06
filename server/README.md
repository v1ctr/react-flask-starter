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

## Testing
### Unit Tests
    $ flask test

### Code Coverage
Code coverage tools measure how much of the application is excercised by unit tests. (Grinberg. M, 2018, Flask Web Development, O'REILLY)

    $ flask test --coverage