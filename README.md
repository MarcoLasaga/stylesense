# 👕 StyleSense

### Image-Based Wardrobe and Outfit Recommendation System

**Using Content-Based and Collaborative Filtering**

---

## 📌 Overview

**StyleSense** is a web-based application designed to help users **maximize their existing wardrobe** by generating intelligent outfit recommendations. Instead of encouraging new purchases, the system focuses on **sustainability, cost-efficiency, and personalization**.

The system uses **image processing and hybrid recommendation algorithms** to analyze clothing attributes and user preferences, enabling users to easily create stylish outfit combinations from clothes they already own.

---

## 🎯 Objectives

* Provide **personalized outfit recommendations**
* Help users **organize and utilize their wardrobe**
* Reduce repetitive outfit choices
* Promote **sustainable fashion practices**
* Enhance user confidence in outfit selection

---

## 🚀 Key Features

### 👗 Wardrobe Management

* Upload clothing images (camera or file upload)
* Manual wardrobe input (type, color, style)
* Automatic clothing detection and classification

### 🤖 Outfit Recommendation System

* Mix-and-match outfit generator
* Content-Based Filtering (based on clothing attributes)
* Collaborative Filtering (based on user preferences)
* “No New Clothes Mode” (prioritizes owned items)

### 📅 Outfit Planner

* Daily and weekly outfit suggestions
* Occasion-based recommendations (casual, school, formal)
* Weather-based outfit suggestions (via API integration)

### 🧠 Personalization

* User preference settings (style, comfort, occasion)
* Adaptive recommendations based on usage

### 🛠️ Admin Dashboard

* Monitor users and wardrobe data
* Manage uploaded clothing items
* View recommendation outputs and system activity
* Analyze performance metrics (response time, usage)

---

## 🧩 System Architecture

The system follows the **IPO Model (Input–Process–Output)**:

### 🔹 Input

* User profile and preferences
* Clothing data (manual + image-based)
* Environmental data (weather)
* User interaction data

### 🔹 Process

* Image processing (OpenCV)
* Clothing classification (TensorFlow/Keras or PyTorch)
* Content-Based Filtering
* Collaborative Filtering
* Outfit generation logic

### 🔹 Output

* Personalized outfit recommendations
* Mix-and-match combinations
* Outfit plans (daily/weekly)
* Organized digital wardrobe

---

## 🏗️ Tech Stack

### Backend

* Python (Flask)

### Frontend

* HTML5
* CSS3
* Bootstrap 5
* JavaScript

### Database

* PostgreSQL
* SQLAlchemy (ORM)

### AI / ML / Image Processing

* OpenCV
* Scikit-learn
* TensorFlow / Keras (or PyTorch)

### APIs

* OpenWeatherMap API (for weather-based recommendations)

---

## 🔐 Authentication

* User registration and login system
* Role-based access control (Admin & User)

### 🔑 Default Admin Account

* **Email:** [admin@stylesense.com](mailto:admin@stylesense.com)
* **Password:** admin123

---

## 📊 Admin Features

* User management
* Clothing dataset monitoring
* Recommendation transparency (algorithm used)
* Performance metrics:

  * Response time
  * Recommendation frequency
  * Image processing activity

---

## 🧪 Testing & Evaluation

The system is evaluated using **ISO/IEC 25010 standards**:

* Functional Suitability
* Usability
* Performance Efficiency
* Security

---

## ⚙️ Installation Guide

```bash
# Clone the repository
git clone https://github.com/your-username/stylesense.git

# Navigate to project folder
cd stylesense

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the application
python app.py
```

---

## 📁 Project Structure

```
stylesense/
│── static/
│   ├── css/
│   ├── js/
│   └── images/
│
│── templates/
│   ├── index.html
│   ├── dashboard.html
│   ├── wardrobe.html
│   ├── recommendations.html
│   └── admin/
│
│── app.py
│── models.py
│── recommender.py
│── image_processor.py
│── config.py
│── requirements.txt
```

---

## ⚠️ Limitations

* Image detection accuracy depends on lighting and image quality
* Limited to basic clothing categories
* No advanced brand or fabric recognition
* Recommendations depend on available user data

---

## 🌱 Future Improvements

* AI-based clothing auto-tagging improvement
* Outfit preview visualization (drag & mix UI)
* Mobile app version
* Advanced fashion trend analysis
* Social sharing of outfits

---

## 👨‍💻 Proponents

* Francis Mico H. Cabrera
* Jonathan Davis Dy
* Sheloh M. Galler
* Marco Antonio T. Lasaga

---

## 📍 Location

Philippines

---

## 📜 License

This project is developed for academic and research purposes.

---

## 💡 Final Note

StyleSense is more than just a recommendation system — it is a **practical solution for everyday fashion challenges**, promoting smarter, more sustainable clothing choices through technology.
