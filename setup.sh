#!/bin/bash

# Quick Start Script for Kawaii Squad Frontend

echo "🦄 Kawaii Squad Frontend Setup"
echo "=============================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "🔧 Creating .env.local..."
    cp .env.local.example .env.local
    echo "✅ .env.local created from template"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Make sure your backend API is running on http://localhost:3000"
echo "2. Update .env.local with your API URL if needed"
echo "3. Run: npm run dev"
echo ""
echo "🌐 Frontend will be available at: http://localhost:5173"
