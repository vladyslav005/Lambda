grammar LambdaCalc;

expression
    : ( globalDecl )* term EOF                # Expr
    ;

globalDecl
    : ID COLON type SEMI                       # GlobalVariableDeclaration
    | ID '=' term (COLON type)? SEMI           # GlobalFunctionDeclaration
    ;

term
    : LAMBDA ID COLON type DOT term (COLON type)?           # LambdaAbstraction
    | <assoc=left> term term                                # Application
    | ID                                                    # Variable
    | '<'term (COMMA term)* '>'                             # Tuple
    | term DOT NATURAL_NUMBER                               # TupleProjection
    | LPAREN term RPAREN                                    # Parentheses
    ;

type
    : (GREEK_TYPE | ID)                      # GreekType
    | <assoc=right> type ARROW type          # FunctionType
    | <assoc=right> type '*' type            # TupleType
    | LPAREN type RPAREN                     # ParenType
    ;

// Lexer rules
LAMBDA         : 'λ' | '\\' ;
ID             : [a-zA-Z_][a-zA-Z0-9_]* ;
GREEK_TYPE     : [\u03B1-\u03C9] ;                 // Matches Greek lowercase letters: α (U+03B1) to ω (U+03C9)
NATURAL_NUMBER :  [1-9] [0-9]*;
COMMA          : ',';
ARROW          : '->' ;
COLON          : ':' ;
DOT            : '.' ;
SEMI           : ';' ;
LPAREN         : '(' ;
RPAREN         : ')' ;
WS             : [ \t\r\n]+ -> skip ;
