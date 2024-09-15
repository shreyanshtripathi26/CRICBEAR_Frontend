# CRICBEAR_Frontend

This repository contains the frontend code for the CRICBEAR application. The project is divided into two main components: the admin/coach dashboard and the public user dashboard.

## Project Structure

```
CRICBEAR_Frontend/
├── dashboardforadmincoach/
└── dashboardforpublicuser/
```

## Getting Started

1. Clone this repository:
   ```
   git clone https://github.com/shreyanshtripathi26/CRICBEAR_Frontend.git
   cd CRICBEAR_Frontend
   ```

2. Choose which dashboard you want to run (admin/coach or public user)

3. Follow the setup and running instructions for the chosen dashboard as detailed below

## Setup and Running

### 1. Dashboard for Admin and Coach

Located in the `dashboardforadmincoach` directory.

1. Navigate to the directory:
   ```
   cd dashboardforadmincoach
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the application:
   ```
   npm start
   ```

#### Functionality

##### Admin
- Login and create a tournament
- Manage users and change their Role
- Start the tournament to generate the schedule
- Start a match
- Initiate the semi-final and final

##### Coach
- Register to the application
- Login and create the team
- Edit and update the team
- Register to a tournament

### 2. Dashboard for Public User

Located in the `dashboardforpublicuser` directory.

1. Navigate to the directory:
   ```
   cd dashboardforpublicuser
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the application:
   ```
   npm start
   ```

#### Functionality

##### User
- View the public dashboard

## Running Both Dashboards Simultaneously

To run both dashboards at the same time, you'll need to open two terminal windows or tabs:

1. In the first terminal:
   ```
   cd CRICBEAR_Frontend/dashboardforadmincoach
   npm install
   npm start
   ```

2. In the second terminal:
   ```
   cd CRICBEAR_Frontend/dashboardforpublicuser
   npm install
   npm start
   ```

Note: You may need to configure different ports for each application if they both try to use the same default port.
