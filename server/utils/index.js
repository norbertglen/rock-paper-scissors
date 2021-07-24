exports.checkWin = (p, c) => {
    if (p === c) {
      return "draw";
    } else if (p === "Rock") {
      if (c === "Paper") {
        return false;
      } else {
        return true;
      }
    } else if (p === "Paper") {
      if (c === "Scissor") {
        return false;
      } else {
        return true;
      }
    } else if (p === "Scissor") {
      if (c === "Rock") {
        return false;
      } else {
        return true;
      }
    }
  };