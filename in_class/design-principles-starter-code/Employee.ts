
// 1. Explain how this program violates the High-Quality Abstraction principle.
/*
The general class Date is used, when it is not as domain specific as it could be. A class could be created to ensure that EmploymentDates are within a valid range.
That class would also be a better place to but methods like `getMonthsInLastPosition()` or `getTotalYearsOfService()`. Or, those two methods/values could be
stored in the employee class, which keeps SRP more closely as well.
*/
// 2. Explain how you would refactor the code to improve its design.
/*
I would edit the Employee class to store the values of total years of service and months in last position. This would better keep SRP in the retirement calculator class
and provide better quality abstraction in the Employee class
*/

class Employee {
	public employmentStartDate: Date;
	public employmentEndDate: Date;
}

class RetirementCalculator {
	private employee: Employee;

	public constructor(emp: Employee) {
		this.employee = emp;
	}

	public calculateRetirement(payPeriodStart: Date, payPeriodEnd: Date): number { … }

	private getTotalYearsOfService(startDate: Date, endDate: Date): number { … }

	private getMonthsInLastPosition(startDate: Date, endDate: Date): number { … }
	
    ...
}
