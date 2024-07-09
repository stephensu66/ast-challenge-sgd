import * as t from '@babel/types';
import generate from '@babel/generator';

export default function generateAST(
  queryInterface: string,
  hookName: string,
  requestType: string,
  responseType: string,
  queryServiceMethod: string,
  keyName: string
): string {
  const interfaceDeclaration = t.exportNamedDeclaration(
    t.tsInterfaceDeclaration(
      t.identifier(queryInterface),
      null,
      [],
      t.tsInterfaceBody([
        t.tsPropertySignature(
          t.identifier('request'),
          t.tsTypeAnnotation(t.tsTypeReference(t.identifier(requestType)))
        ),
        t.tsPropertySignature(
          t.identifier('options'),
          t.tsTypeAnnotation(
            t.tsTypeReference(t.identifier('ReactQueryParams'))
          )
        )
      ])
    ),
    []
  );

  const constDeclaration = t.variableDeclaration('const', [
    t.variableDeclarator(
      t.identifier(hookName),
      t.arrowFunctionExpression(
        [
            t.identifier('request'),
            t.identifier('options')
        ],
        t.blockStatement([
          t.returnStatement(
            t.callExpression(
              t.identifier('useQuery'),
              [
                // t.tsTypeParameterInstantiation([
                //   t.tsTypeReference(t.identifier(responseType)),
                //   t.tsTypeReference(t.identifier('Error')),
                //   t.tsTypeReference(t.identifier('TData'))
                // ]),
                t.arrayExpression([
                  t.stringLiteral(keyName),
                  t.identifier('request')
                ]),
                t.arrowFunctionExpression(
                  [],
                  t.blockStatement([
                    t.ifStatement(
                      t.unaryExpression('!', t.identifier('queryService')),
                      t.throwStatement(
                        t.newExpression(t.identifier('Error'), [
                          t.stringLiteral('Query Service not initialized')
                        ])
                      )
                    ),
                    t.returnStatement(
                      t.callExpression(
                        t.memberExpression(
                          t.identifier('queryService'),
                          t.identifier(queryServiceMethod)
                        ),
                        [t.identifier('request')]
                      )
                    )
                  ])
                ),
                t.identifier('options')
              ]
            )
          )
        ])
      )
    )
  ]);

  const program = t.program([interfaceDeclaration, constDeclaration]);

  return generate(t.file(program)).code;
}
