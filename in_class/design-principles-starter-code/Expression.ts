
// 1. What design principles does this code violate?
/*
Simplicity, it uses one if statement with an extremely complex condition statement, rather than if-else statements.
High-Quality abstraction because the variables are poorly named. What type of score is `score` tracking? What are they authorized for is `authorized` is true? Those
variables could be much better named. 
Decomposition, the logic can be put into separate methods
*/
// 2. Refactor the code to improve its design.

function highCreditScore (creditScore:number){
	return creditScore > 700;
}

function highIncome(income:number){
	return income > 100_000 
}

function middleIncome(income:number){
	return (income >= 40000) && (income <= 100000)
}

function isLowRiskClient(creditScore: number, income: number, authorized: boolean): boolean {
	if (highCreditScore(creditScore) ||
		(middleIncome(income) && authorized && (creditScore > 500)) ||
		highIncome(income)){

		return false;
	}
	else {
		return true;
	}
}