"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Player = "X" | "O" | null;
type Board = Player[];

interface GameState {
  board: Board;
  currentPlayer: Player;
  winner: Player;
  gameOver: boolean;
  isAIPlayer: boolean;
}

const WINNING_COMBINATIONS = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal
  [2, 4, 6], // Diagonal
];

export function TicTacToe() {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(9).fill(null),
    currentPlayer: "X",
    winner: null,
    gameOver: false,
    isAIPlayer: false,
  });

  const [gameMode, setGameMode] = useState<"human" | "ai">("human");
  const [isLoading, setIsLoading] = useState(false);

  // Check for winner
  const checkWinner = (board: Board): Player => {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  // Check if board is full
  const isBoardFull = (board: Board): boolean => {
    return board.every(cell => cell !== null);
  };

  // Handle cell click
  const handleCellClick = async (index: number) => {
    if (gameState.gameOver || gameState.board[index] || isLoading) {
      return;
    }

    const newBoard = [...gameState.board];
    newBoard[index] = gameState.currentPlayer;

    const winner = checkWinner(newBoard);
    const gameOver = winner !== null || isBoardFull(newBoard);

    const newGameState: GameState = {
      board: newBoard,
      currentPlayer: gameState.currentPlayer === "X" ? "O" : "X",
      winner,
      gameOver,
      isAIPlayer: gameMode === "ai" && gameState.currentPlayer === "X",
    };

    setGameState(newGameState);

    // If playing against AI and it's AI's turn, make AI move
    if (gameMode === "ai" && !gameOver && newGameState.currentPlayer === "O") {
      await makeAIMove(newBoard);
    }
  };

  // Make AI move
  const makeAIMove = async (currentBoard: Board) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tic-tac-toe/ai-move", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          board: currentBoard,
          player: "O",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI move");
      }

      const { move } = await response.json();
      
      if (move !== null && move >= 0 && move < 9 && currentBoard[move] === null) {
        const newBoard = [...currentBoard];
        newBoard[move] = "O";

        const winner = checkWinner(newBoard);
        const gameOver = winner !== null || isBoardFull(newBoard);

        setGameState({
          board: newBoard,
          currentPlayer: "X",
          winner,
          gameOver,
          isAIPlayer: false,
        });
      }
    } catch (error) {
      console.error("Error making AI move:", error);
      // Fallback: make a random move
      const availableMoves = currentBoard
        .map((cell, index) => cell === null ? index : null)
        .filter(index => index !== null) as number[];
      
      if (availableMoves.length > 0) {
        const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        const newBoard = [...currentBoard];
        newBoard[randomMove] = "O";

        const winner = checkWinner(newBoard);
        const gameOver = winner !== null || isBoardFull(newBoard);

        setGameState({
          board: newBoard,
          currentPlayer: "X",
          winner,
          gameOver,
          isAIPlayer: false,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Reset game
  const resetGame = () => {
    setGameState({
      board: Array(9).fill(null),
      currentPlayer: "X",
      winner: null,
      gameOver: false,
      isAIPlayer: false,
    });
  };

  // Get game status message
  const getGameStatus = () => {
    if (gameState.winner) {
      return `Player ${gameState.winner} wins!`;
    }
    if (gameState.gameOver) {
      return "It's a draw!";
    }
    if (isLoading) {
      return "AI is thinking...";
    }
    return `Current player: ${gameState.currentPlayer}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Tic Tac Toe</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Game Mode Selection */}
          <div className="flex gap-2 justify-center">
            <Button
              variant={gameMode === "human" ? "default" : "outline"}
              onClick={() => {
                setGameMode("human");
                resetGame();
              }}
              disabled={isLoading}
            >
              vs Human
            </Button>
            <Button
              variant={gameMode === "ai" ? "default" : "outline"}
              onClick={() => {
                setGameMode("ai");
                resetGame();
              }}
              disabled={isLoading}
            >
              vs AI
            </Button>
          </div>

          {/* Game Status */}
          <div className="text-center text-lg font-semibold">
            {getGameStatus()}
          </div>

          {/* Game Board */}
          <div className="grid grid-cols-3 gap-2 w-full max-w-xs mx-auto">
            {gameState.board.map((cell, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-16 w-16 text-2xl font-bold"
                onClick={() => handleCellClick(index)}
                disabled={gameState.gameOver || cell !== null || isLoading}
              >
                {cell}
              </Button>
            ))}
          </div>

          {/* Reset Button */}
          <div className="flex justify-center">
            <Button onClick={resetGame} disabled={isLoading}>
              Reset Game
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
