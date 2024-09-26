# Onboarding Development

## Requirements

- [MySQL - Utilize Laragon for easy install](https://laragon.org/download/)
- [NodeJS](https://nodejs.org/en/download/package-manager) 18+

## Setup Environment and install requirements

```bash
#Copy .env.example to .env and fill in your credentials.
cp .env.example .env

# Edit DATABASE_URL Depending on your mySQL Server. with the following format
DATABASE_URL="mysql://{user}:{password}@{server}:3306/{dbname}"

# Example without password and server is localhost db name is mydb
DATABASE_URL="mysql://root:@localhost:3306/mydb"
# Same as above but with password
DATABASE_URL="mysql://root:secret@localhost:3306/mydb"
```

## Running dev server

```bash
#1. Install dependencies
npm i

#2. For development use db push, when changes are made to the schema
npm run db:sync # This commands uses db push to sync the db with schema and generate prisma client

#4. Run dev server
npm run dev
```
