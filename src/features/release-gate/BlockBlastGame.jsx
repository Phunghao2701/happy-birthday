import { useState } from "react";

const GRID_SIZE = 8;
const SHAPES = [
  [[0, 0]],
  [[0, 0], [0, 1]],
  [[0, 0], [0, 1], [0, 2]],
  [[0, 0], [1, 0], [2, 0]],
  [[0, 0], [0, 1], [0, 2], [0, 3]],
  [[0, 0], [1, 0], [2, 0], [3, 0]],
  [[0, 0], [0, 1], [1, 0], [1, 1]],
  [[0, 0], [1, 0], [2, 0], [2, 1]],
  [[0, 1], [1, 0], [1, 1], [1, 2]],
  [[0, 0], [0, 1], [1, 1], [1, 2]],
  [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]],
];

const createBoard = () => Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(false));
const createPiece = () => ({
  id: `${Date.now()}-${Math.random()}`,
  cells: SHAPES[Math.floor(Math.random() * SHAPES.length)],
});
const createRack = () => Array.from({ length: 3 }, createPiece);

function canPlaceAt(board, cells, row, column) {
  return cells.every(([dy, dx]) => {
    const nextRow = row + dy;
    const nextColumn = column + dx;
    return nextRow >= 0 && nextRow < GRID_SIZE && nextColumn >= 0 && nextColumn < GRID_SIZE && !board[nextRow][nextColumn];
  });
}

function canFitAnywhere(board, cells) {
  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let column = 0; column < GRID_SIZE; column += 1) {
      if (canPlaceAt(board, cells, row, column)) return true;
    }
  }
  return false;
}

function PiecePreview({ cells }) {
  return (
    <div className="grid size-12 grid-cols-4 grid-rows-4 gap-[3px]" aria-hidden="true">
      {Array.from({ length: 16 }, (_, index) => {
        const row = Math.floor(index / 4);
        const column = index % 4;
        const filled = cells.some(([dy, dx]) => dy === row && dx === column);
        return <span key={index} className={filled ? "rounded-[3px] border border-[#201c28] bg-[#fa6294] shadow-[1px_2px_0_#201a2b]" : "rounded-[3px]"} />;
      })}
    </div>
  );
}

export function BlockBlastGame() {
  const [board, setBoard] = useState(createBoard);
  const [pieces, setPieces] = useState(createRack);
  const [selected, setSelected] = useState(null);
  const [hover, setHover] = useState(null);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("Chọn một khối, rồi chạm vào ô muốn đặt.");
  const [gameOver, setGameOver] = useState(false);

  const selectedPiece = selected === null ? null : pieces[selected];
  const previewValid = Boolean(hover && selectedPiece && canPlaceAt(board, selectedPiece.cells, hover[0], hover[1]));

  const placeAt = (row, column) => {
    if (gameOver) return;
    if (!selectedPiece) {
      setMessage("Chọn một khối trước nhé!");
      return;
    }
    if (!canPlaceAt(board, selectedPiece.cells, row, column)) {
      setMessage("Khối chưa vừa chỗ này. Thử vị trí khác nhé!");
      return;
    }

    const placed = board.map((line) => [...line]);
    selectedPiece.cells.forEach(([dy, dx]) => { placed[row + dy][column + dx] = true; });
    const fullRows = placed.map((line, index) => line.every(Boolean) ? index : -1).filter((index) => index >= 0);
    const fullColumns = Array.from({ length: GRID_SIZE }, (_, index) => index).filter((col) => placed.every((line) => line[col]));
    const rowSet = new Set(fullRows);
    const columnSet = new Set(fullColumns);
    const clearedBoard = placed.map((line, rowIndex) => line.map((cell, columnIndex) => rowSet.has(rowIndex) || columnSet.has(columnIndex) ? false : cell));
    const clearedLines = fullRows.length + fullColumns.length;
    const points = selectedPiece.cells.length + clearedLines * 10;

    let nextPieces = pieces.map((piece, index) => index === selected ? null : piece);
    if (nextPieces.every((piece) => piece === null)) nextPieces = createRack();
    const isGameOver = !nextPieces.some((piece) => piece && canFitAnywhere(clearedBoard, piece.cells));

    setBoard(clearedBoard);
    setPieces(nextPieces);
    setSelected(null);
    setHover(null);
    setScore((current) => current + points);
    setGameOver(isGameOver);
    setMessage(isGameOver ? "Hết chỗ rồi! Chơi lại một ván nữa nhé." : clearedLines ? `Tuyệt vời! Xóa ${clearedLines} hàng/cột · +${points} điểm!` : `+${points} điểm! Chọn khối tiếp theo nhé.`);
  };

  const restart = () => {
    setBoard(createBoard());
    setPieces(createRack());
    setSelected(null);
    setHover(null);
    setScore(0);
    setMessage("Chọn một khối, rồi chạm vào ô muốn đặt.");
    setGameOver(false);
  };

  return (
    <div className="text-[#201c28]">
      <div className="mb-3 flex items-center justify-between rounded-xl border-2 border-[#201c28] bg-[#ffdf55] px-3 py-2 shadow-[3px_4px_0_#201a2b]">
        <span className="font-display text-xs font-bold tracking-wider">ĐIỂM</span>
        <strong className="font-display text-xl font-bold tabular-nums">{score}</strong>
      </div>

      <div className="relative mx-auto w-[min(80vw,38dvh,360px)] rounded-xl border-[3px] border-[#201c28] bg-[#d9ccf7] p-1 shadow-[4px_5px_0_#201a2b]">
        <div className="grid aspect-square grid-cols-8 grid-rows-8 gap-[3px]" aria-label="Bàn chơi 8 nhân 8">
          {board.map((line, row) => line.map((occupied, column) => {
            const inPreview = Boolean(hover && selectedPiece && selectedPiece.cells.some(([dy, dx]) => hover[0] + dy === row && hover[1] + dx === column));
            const tone = occupied ? "border-[#201c28] bg-[#fa6294] shadow-[1px_2px_0_#201a2b]" : inPreview ? previewValid ? "border-[#201c28] bg-[#ffdf55]" : "border-[#a72d58] bg-[#f6a5ba]" : "border-[#201c28]/20 bg-[#fff8e9]";
            return (
              <button
                key={`${row}-${column}`}
                type="button"
                aria-label={`Hàng ${row + 1}, cột ${column + 1}${occupied ? ", đã có khối" : ""}`}
                onPointerEnter={() => setHover([row, column])}
                onClick={() => placeAt(row, column)}
                className={`aspect-square min-w-0 rounded-[4px] border transition-colors duration-100 ${tone}`}
              />
            );
          }))}
        </div>
        {gameOver && (
          <div className="absolute inset-0 grid place-items-center rounded-lg bg-[#fff8e9]/90 p-4 text-center">
            <div>
              <p className="font-display text-2xl font-bold">HẾT CHỖ RỒI!</p>
              <p className="mt-1 text-xs font-semibold">Bạn ghi được {score} điểm.</p>
              <button type="button" onClick={restart} className="mt-3 rounded-full border-2 border-[#201c28] bg-[#ffdf55] px-4 py-2 font-display text-xs font-bold shadow-[3px_4px_0_#201a2b]">CHƠI LẠI</button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {pieces.map((piece, index) => (
          <button
            key={piece?.id ?? `empty-${index}`}
            type="button"
            aria-label={piece ? `Chọn khối ${index + 1}` : "Khối đã đặt"}
            aria-pressed={selected === index}
            disabled={!piece || gameOver}
            onClick={() => {
              if (!piece) return;
              setSelected(selected === index ? null : index);
              setHover(null);
              setMessage(selected === index ? "Chọn một khối, rồi chạm vào ô muốn đặt." : "Chạm vào ô muốn đặt khối nhé!");
            }}
            className={`grid min-h-[72px] place-items-center rounded-xl border-2 border-[#201c28] px-2 py-2 shadow-[3px_4px_0_#201a2b] transition-transform disabled:opacity-45 ${selected === index ? "-translate-y-1 bg-[#fa6294]" : "bg-white"}`}
          >
            {piece ? <PiecePreview cells={piece.cells} /> : <span className="font-display text-xl font-bold text-[#8a7d8f]">✓</span>}
          </button>
        ))}
      </div>
      <p role="status" aria-live="polite" className="mt-3 min-h-5 text-center text-[10px] font-bold sm:text-xs">{message}</p>
    </div>
  );
}