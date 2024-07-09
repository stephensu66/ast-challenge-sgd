import  generateAST  from '../src/index';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('AST Challenge', () => {
    it('should generate code correctly for a single method', () => {
        const resultingCode = generateAST(
            'UsePoolsQuery',
            'usePools',
            'QueryPoolsRequest',
            'QueryPoolsResponse',
            'pools',
            'poolsQuery'
        );
        expect(resultingCode).toMatchSnapshot();
        });


    it('should generate code for all example methods', () => {
        const exampleMethods = JSON.parse(readFileSync(resolve(__dirname, '../example-methods.json'), 'utf-8'));
    
        Object.keys(exampleMethods).forEach((methodName) => {
            const method = exampleMethods[methodName];
            const resultingCode = generateAST(
            `Use${methodName}Query`,
            `use${methodName}`,
            method.requestType,
            method.responseType,
            methodName,
            `${methodName.toLowerCase()}Query`
            );
            expect(resultingCode).toMatchSnapshot();
        });
        });
});