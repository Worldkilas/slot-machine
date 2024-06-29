// 1. Deposit some money
// 2. Determine the number of linees to bet on
// 3. Collect a bet amount
// 4. Spin the slot machine
// 5. Check if the user won
// 6. Give the user their winnings
// 7. Play again  

const prompt=require("prompt-sync")();

//GLOBAL VARIABLES
const ROWS=3;
const COLS=3;

const SYMBOLS_COUNT={
    'A': 2,
    'B': 4,
    'C':6,
    'D':8
}
//multipliers for the symbol when a bet has been on a line  
const SYMBOLS_VALUES={
    'A': 5,
    'B': 4,
    'C':3,
    'D':2
}

//FUNCTIONS
const getDeposit = () => {
    while (true) {
        // get deposi amount from useer then cpnvert to a number
    const depositAmount= parseFloat(prompt("Enter a deposit amount: "));
    
    if (isNaN(depositAmount) || depositAmount<=0) {
        console.log('Invalid deposit amount. Enter a valid number that is not 0');
    }else{
        return depositAmount;
    }
    }
};

const getNumberOfLines = () => {
    while (true) {
        const lines= prompt("Enter the number of lines you want to bet on(1-3): ");
        const numberOfLines=parseFloat(lines);
        if (isNaN(numberOfLines)|| numberOfLines<=0|| numberOfLines>3) {
            console.log('Invalud numer of lines, try again');
        }else{
            return numberOfLines;
        }
    }
}

const getBet = (balance,lines) => {
    while (true) {
        const bet= parseFloat(prompt("Enter the bet per line: "));
       
        if (isNaN(bet)|| bet<=0|| bet>(balance/lines)) {
            console.log('Invalud bet, try again');
        }else{
            return bet;
        }
    }
}

const spin = () => {
    const symbols=[];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let index = 0; index < count; index++) {
            symbols.push(symbol)
            
        }
        
    }
    const reels=[]
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        // An array that contains the symbols to be randomly selected from
        // It adds a copy of symbols array to new array so we dont modify the original array containing all the list of possible symbols when splicing
        // Splicing is done in order to prevent an already selected symbol from being selected again
        const reelSymbols=[...symbols] 

        for (let j = 0; j < ROWS; j++) {
            const randomIndex= Math.floor(Math.random()*reelSymbols.length)
            const selectedSymbol= reelSymbols[randomIndex]
            reels[i].push(selectedSymbol)
            reelSymbols.splice(randomIndex, 1)
        }
        
    }
    

    return reels
}

const transpose = (reels) => {
    const rows=[]
    for (let i = 0; i < ROWS; i++) {
        rows.push([])
        for (let j = 0; j < COLS; j++) {
                rows[i].push(reels[j][i])
            
        }
        
    }
    return rows
}

const formatRows = (rows) => {
    for (const row of rows) {
        let rowString=''
        for (const [index, symbol] of row.entries()) {
            rowString+= symbol
            if (index!= row.length-1) {
                rowString+=' | '
            }
        }
        console.log(rowString);
        
    }
    
}

const getWinnings = (rows, bets, lines) => {
    let winnings=0
    for (let rowIndex = 0; rowIndex < lines; rowIndex++) {
        const symbols=rows[rowIndex]
        let allSame= true
        for (const symbol of symbols) {
            if (symbol!=symbols[0]) {
                allSame= false
                break
            }
        }
        if (allSame) {
            winnings= bets* SYMBOLS_VALUES[symbols[0]]
        }
        
    }
    return winnings
}

const play = () => {
    let balance=getDeposit();
    
    while (true) {
        console.log("You have a balance of $"+ balance.toString());
        const numberOfLines= getNumberOfLines();
        const bet= getBet(balance, numberOfLines);
        balance-= bet* numberOfLines
        const reels =spin()
        const rows=transpose(reels)
        formatRows(rows)
        const winnings= getWinnings(rows, bet, numberOfLines)
        balance+= winnings
        console.log("You won, $" + winnings.toString());
        if (balance===0) {
            console.log("You ran out of balance");
            break
        }
        const playAgain= prompt("Do you want to play again? (y/n)")
        if (playAgain!='y') break 
    }
}
play()

