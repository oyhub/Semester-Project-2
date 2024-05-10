[![angular - 14.2.0](https://img.shields.io/badge/angular-14.2.0-blue?logo=angular)](https://angular.dev/)

# The Wine Seller

This is a school assignment, where we will create an auction page.
The brief is that an auction site is looking to launch a website where users can add items to be bid on and bid on items other users have put up for auction.

**The Wine Seller hompage example**
![The Wine Seller homepage screenshot](/src/assets/images/homepageScreenshot.jpg)

## Built with

- [Angular](https://angular.io/)
- [Sass](https://sass-lang.com/)

## Getting started

### Installing

1. Clone the repo:
```
git clone https://github.com/oyhub/Semester-Project-2.git
```

2. Install NPM Packages
```
npm install
```

### Development server
To run a local development server with the project, do the following
```
npm run start
```
and navigate to 
`http://localhost:4200/`

### Customize
You can customize the page by changing the variables in
[src/app/app.constants.ts](src/app/app.constants.ts) and [src/styles/_variables.scss](src/styles/_variables.scss)

```
src/app/app.constants.ts
src/styles/_variables.scss
```

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Filter on wines
The app is now set to show all listings from the auctoinhouse API. If you want to only show winebottles that are added from The Wine Seller,
set `ONLY_WINES` in the `app.constants.ts` to `true`.


## Validation Service
To make validation easier, you can use the project's validation service. 
For example, if you set a validationMessage to display errors, you can easily show the correct error
based on what has been incorrectly validated.

Read the documentation for [Validation Service](VALIDATION.md) for more info.


 
