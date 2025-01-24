grammar LambdaCalc;

expression
    : ( globalDecl )* terms  EOF                # Expr
    ;

terms
    : (term SEMI (term SEMI)* (globalDecl)*)+ # Sequence
    ;



globalDecl
    : ID COLON type SEMI                       # GlobalVariableDeclaration
    | ID '=' term (COLON type)? SEMI           # GlobalFunctionDeclaration
    | type '=
    ;

term
    : LAMBDA ID COLON type DOT term (COLON type)?           # LambdaAbstraction
    | <assoc=left> term term                                # Application
    | ID                                                    # Variable
    | '<' ID'='term (COMMA ID'='term)*'>'                   # Record
    | term DOT ID                                           # RecordProjection
    | '<'term (COMMA term)* '>'                             # Tuple
    | term DOT NATURAL_NUMBER                               # TupleProjection
//    | term SEMI term                                        # Sequence
    | LPAREN term RPAREN                                    # Parentheses
    ;

type
    : (GREEK_TYPE | ID)                                          # GreekType
    | <assoc=right> type ARROW type                              # FunctionType
    | '<' ID COLON type (COMMA ID COLON type)* '>'               # RecordType
    | <assoc=right> type '*' type                                # TupleType
    | LPAREN type RPAREN                                         # ParenType
    ;

// Lexer rules
LAMBDA         : 'λ' | '\\' ;
EQ             : '=';
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
