# Aalto Intro to AI and ML Project

## Overview
This repository contains the Aalto University “Introduction to AI and Machine Learning” course project. It provides implementations of core AI/ML algorithms, sample datasets, and utilities to experiment with models and visualize results.

## Prerequisites
- **Python 3.8+**
  - Download and install from the official website: https://www.python.org/downloads/
  - Verify installation:
    ```bash
    python3 --version
    ```
- **pip** (Python package installer)
  - Usually included with Python 3 installations. Check with:
    ```bash
    pip3 --version
    ```
- **virtualenv** (optional but recommended)
  - Create isolated environments:
    ```bash
    pip3 install virtualenv
    ```

## Installation
1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/aalto-intro-ai-ml.git
    cd aalto-intro-ai-ml
    ```
2. **Create and activate a virtual environment** (optional):
    ```bash
    virtualenv venv
    # On macOS/Linux
    source venv/bin/activate
    # On Windows (PowerShell)
    .\venv\Scripts\Activate.ps1
    ```
3. **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

## Project Structure
aalto-intro-ai-ml/<br>
├── data/ # Sample datasets (CSV, images, etc.)<br>
│ ├── raw/ # Unprocessed data<br>
│ └── processed/ # Cleaned and transformed data<br>
├── notebooks/ # Jupyter notebooks for exploration and tutorials<br>
│ ├── 01_data_preprocessing.ipynb<br>
│ └── 02_model_training.ipynb<br>
├── src/ # Core source code<br>
│ ├── data/ # Data loading and preprocessing modules<br>
│ ├── models/ # Model definitions (e.g., neural nets, SVM)<br>
│ ├── utils/ # Utility functions (metrics, visualization)<br>
│ └── main.py # Entry point for training and evaluation<br>
├── configs/ # Configuration files (YAML) for training and evaluation<br>
├── requirements.txt # Project dependencies<br>
├── README.md # Project overview and instructions<br>
└── .gitignore # Files and directories to ignore in git<br>

## Usage
1. **Prepare data** (if adding new datasets):
    ```bash
    python src/main.py --mode preprocess --input data/raw/ --output data/processed/
    ```
2. **Train a model**:
    ```bash
    python src/main.py --mode train --config configs/train_config.yaml
    ```
3. **Evaluate a model**:
    ```bash
    python src/main.py --mode evaluate --model path/to/model.pth --data data/processed/
    ```
4. **Visualize results**:
    Open the notebooks in `notebooks/` and run the cells to generate plots and metrics.

## Configuration
- Configuration files are stored in `configs/`. Modify hyperparameters, dataset paths, and training settings as needed.

## Contributing
1. Fork the repository  
2. Create a new branch: `git checkout -b feature/your-feature`  
3. Commit your changes: `git commit -m "Add your feature"`  
4. Push to branch: `git push origin feature/your-feature`  
5. Open a pull request  