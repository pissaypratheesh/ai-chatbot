import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { myProvider } from "@/lib/ai/providers";

type Player = "X" | "O" | null;
type Board = Player[];

interface AIMoveRequest {
  board: Board;
  player: Player;
}

interface AIMoveResponse {
  move: number | null;
  reasoning?: string;
}

/**
 * POST /api/tic-tac-toe/ai-move
 * Generate AI move for Tic Tac Toe game
 */
export async function POST(request: NextRequest) {
  try {
    const body: AIMoveRequest = await request.json();
    const { board, player } = body;

    // Validate input
    if (!board || !Array.isArray(board) || board.length !== 9) {
      return NextResponse.json(
        { error: "Invalid board format" },
        { status: 400 }
      );
    }

    if (player !== "O") {
      return NextResponse.json(
        { error: "AI only plays as O" },
        { status: 400 }
      );
    }

    // Check if game is already over
    const winner = checkWinner(board);
    if (winner !== null || isBoardFull(board)) {
      return NextResponse.json(
        { move: null, reasoning: "Game is already over" },
        { status: 200 }
      );
    }

    // Get available moves
    const availableMoves = board
      .map((cell, index) => cell === null ? index : null)
      .filter(index => index !== null) as number[];

    if (availableMoves.length === 0) {
      return NextResponse.json(
        { move: null, reasoning: "No available moves" },
        { status: 200 }
      );
    }

    // Create board representation for AI
    const boardString = board
      .map(cell => cell || " ")
      .join("");

    const prompt = `You are playing Tic Tac Toe as player O. The current board state is:

Row 1: ${board[0] || " "} | ${board[1] || " "} | ${board[2] || " "}
Row 2: ${board[3] || " "} | ${board[4] || " "} | ${board[5] || " "}
Row 3: ${board[6] || " "} | ${board[7] || " "} | ${board[8] || " "}

Available positions (0-8): ${availableMoves.join(", ")}

Rules:
- You are player O
- Player X goes first
- Make the best strategic move
- Try to win if possible
- Block opponent from winning if they have 2 in a row
- Take center if available
- Take corners if center is taken
- Avoid edges unless necessary

Respond with ONLY a JSON object in this exact format:
{"move": <position_number>, "reasoning": "<brief_explanation>"}

Where position_number is 0-8 corresponding to the board position.`;

    try {
      const { text } = await generateText({
        model: myProvider.languageModel("chat-model"),
        prompt,
        temperature: 0.1, // Low temperature for more consistent moves
      });

      // Parse AI response
      const aiResponse = JSON.parse(text);
      const move = parseInt(aiResponse.move);

      // Validate move
      if (isNaN(move) || move < 0 || move > 8 || board[move] !== null) {
        throw new Error("Invalid move from AI");
      }

      return NextResponse.json({
        move,
        reasoning: aiResponse.reasoning || "AI made a strategic move",
      });

    } catch (aiError) {
      console.error("AI move generation failed:", aiError);
      
      // Fallback to strategic move
      const strategicMove = getStrategicMove(board, availableMoves);
      
      return NextResponse.json({
        move: strategicMove,
        reasoning: "Fallback strategic move",
      });
    }

  } catch (error) {
    console.error("Tic Tac Toe AI API error:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to generate AI move",
        move: null,
      },
      { status: 500 }
    );
  }
}

// Helper functions
function checkWinner(board: Board): Player {
  const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6], // Diagonals
  ];

  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function isBoardFull(board: Board): boolean {
  return board.every(cell => cell !== null);
}

function getStrategicMove(board: Board, availableMoves: number[]): number {
  // 1. Try to win
  for (const move of availableMoves) {
    const testBoard = [...board];
    testBoard[move] = "O";
    if (checkWinner(testBoard) === "O") {
      return move;
    }
  }

  // 2. Block opponent from winning
  for (const move of availableMoves) {
    const testBoard = [...board];
    testBoard[move] = "X";
    if (checkWinner(testBoard) === "X") {
      return move;
    }
  }

  // 3. Take center if available
  if (availableMoves.includes(4)) {
    return 4;
  }

  // 4. Take corners
  const corners = [0, 2, 6, 8];
  for (const corner of corners) {
    if (availableMoves.includes(corner)) {
      return corner;
    }
  }

  // 5. Take any available move
  return availableMoves[0];
}
