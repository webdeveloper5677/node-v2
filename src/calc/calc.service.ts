import { BadRequestException, Injectable } from '@nestjs/common';
import { CalcDto } from './calc.dto';
import { throwError } from 'rxjs';

@Injectable()
export class CalcService {
  calculateExpression(calcBody: CalcDto) {
    try {
      // Split the expression into elements
      //const elements = expression.split('');
      const elements = calcBody.expression.match(/\d+|\+|\-|\*|\//g);
      if (!elements) {
        throw new Error("Invalid expression provided");
      }

      const operators: string[] = [];
      const outputArr: (number | string)[] = [];

      // precedence obj
      const precedence = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2
      };

      const result = this.solveExpression(elements, operators, outputArr, precedence)
      return result;

    } catch (err) {
      throw new BadRequestException({
        "statusCode": 400,
        "message": "Invalid expression provided",
        "error": "Bad Request"
      })
    }
  }

  solveExpression(elements : any[], operators: string[], outputArr : (number | string)[], precedence : any) {

    function implementOperations(operator: string, x: number, y: number): number {
      switch (operator) {
        case '+': return x + y;
        case '-': return x - y;
        case '*': return x * y;
        case '/':
          if (y === 0){
            throw new Error("Division by zero not possible");
          }
          // return Math.floor(x / y); // Integer division
          return (x/y)
        default: throw new Error("Invalid operator");
      }
    }

    elements.forEach(element => {
      if (!isNaN(parseInt(element))) {
        //console.log("tttttttttt",element)
        // if element is a number then push to outputArr
        outputArr.push(parseInt(element));
      } else if (element in precedence) {
        // if element is an operator then handle operator precedence
        while (operators.length > 0 && precedence[operators[operators.length - 1]] >= precedence[element]) {
          outputArr.push(operators.pop() as string);
        }
        operators.push(element);
      } else {
        throw new Error("Invalid element in expression");
      }
    });

    // Pop remaining operators to outputArr
    while (operators.length > 0) {
      outputArr.push(operators.pop() as string);
    }

    // final operation
    const elementsArr: number[] = [];
    outputArr.forEach(element => {
      if (typeof element === 'number') {
        elementsArr.push(element);
      } else {
        const y = elementsArr.pop();
        const x = elementsArr.pop();
        if (x === undefined || y === undefined) {
          throw new Error("Invalid element in expression");
        }
        const result = implementOperations(element, x, y);
        elementsArr.push(result);
      }
    });

    if (elementsArr.length !== 1) { 
      throw new Error("Invalid expression");
    }

    return elementsArr.pop() as number;
  }
}
