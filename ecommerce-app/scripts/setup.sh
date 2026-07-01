#!/bin/bash
echo "Installing backend dependencies..."
cd project/backend && npm install

echo "Installing frontend dependencies..."
cd ../frontend && npm install

echo ""
echo "Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Copy project/backend/.env.example → project/backend/.env and fill in values"
echo "  2. Copy project/frontend/.env.example → project/frontend/.env and set VITE_API_URL"
echo "  3. In one terminal: cd project/backend && npm run dev"
echo "  4. In another terminal: cd project/frontend && npm run dev"
echo "  5. Open http://localhost:5173"
