# Event & Vendor Booking Platform

A comprehensive, role-based web application designed to streamline event planning by connecting clients, event organizers, and service vendors (catering, decor, venues, photography) under a single digital ecosystem. 

This project fulfills the **Third Year (TY) Mini Project** requirement.

---

## 📌 Project Overview
Planning an event traditionally requires coordinating with multiple independent vendors, leading to communication gaps and scheduling conflicts. The **Event & Vendor Booking Platform** solves this by offering a unified marketplace. Clients can browse verified vendors, check real-time availability, build custom event packages, and manage bookings seamlessly through an interactive dashboard.

### 🌟 Key Features
* **Role-Based Interfaces:** Distinct user views and workflow paths for **Clients**, **Vendors**, and **Administrators**.
* **Vendor Marketplace:** Advanced search and filter functionalities allowing users to sort vendors by category (e.g., Catering, Decor, Photography), location, budget, and ratings.
* **Real-Time Booking & Scheduling:** An interactive scheduling framework preventing double-booking of vendor services on identical dates.
* **Package Customization:** Clients can bundle multiple vendor services (e.g., Venue + Catering) into a single event itinerary.
* **Admin Control Center:** A centralized panel for managing user listings, approving/verifying new vendor registrations, and keeping track of platform usage metrics.
* **Relational Data Mapping:** Structured transactional flows ensuring smooth checkout logs, status updates, and booking history retrieval.

---

## 🛠️ Tech Stack

* **Frontend:** React.js, HTML5, CSS3, JavaScript (ES6)
* **Backend:** Node.js, Express.js
* **Database:** MySQL

---

## 📝 Database Schema Design
The relational flow maps direct data connections across core system modules in the MySQL database:

* **Users Table:** Stores client and administrator details, contact profiles, and role classifications.
* **Vendors Table:** Holds service profiles, operational categories, pricing baselines, locations, and verification status fields.
* **Bookings Table:** Tracks distinct transactional links connecting `ClientID`, `VendorID`, execution dates, total event costs, and current status flags (`Pending`, `Approved`, `Cancelled`).

---
