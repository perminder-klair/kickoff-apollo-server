## `kickoff-apollo-server`

> A very lean boilerplate for setting up GraphQL server.

#### Requirements

```bash
- Node >=v16.16.0
- NPM >=v8.11.0
- MongoDB
```

### Setup

```bash
  # clone the repository
  λ git clone https://github.com/perminder-klair/kickoff-apollo-server
  # change the current directory
  λ cd kickoff-apollo-server
  # install all dependencies
  λ yarn install
  # run the project
  λ yarn dev
```

### Structure

```bash
├── README.md           # you're here
├── src                 # contains source files
```

### Scripts

- `yarn start` - simply starts the server
- `yarn dev` -  starts the server with reloading
- `yarn lint` - lints and fix all the files in `src/` folder
- `yarn build-email` - builds the email templates from mjml to ejs
