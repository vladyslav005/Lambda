grammar LambdaCalc;

expression
    : ( globalDecl )* terms  EOF              # Expr
    ;

terms
    : (term SEMI (term SEMI)* (globalDecl)*)+ # Sequence
    ;

globalDecl
    : ID COLON type SEMI                      # GlobalVariableDeclaration
    | ID EQ term (COLON type)? SEMI           # GlobalFunctionDeclaration
    | type EQ type SEMI                       # TypeAlias
    ;

term
    : LAMBDA ID COLON type DOT term (COLON type)?                                    # LambdaAbstraction
    | LAMBDA '_' COLON type DOT term (COLON type)?                                   # WildCard
    | 'if' term 'then' term ('else if' term 'then' term)* ('else' term)?             # IfElse
    | <assoc=left> term term                                                         # Application
    | ID                                                                             # Variable
    | constant                                                                       # Literal
    | '['ID EQ term']' 'as' type                                                     # Injection
    | ('inl'|'inr') term 'as' type                                                   # LeftRightInj
    | '<' ID EQ term (COMMA ID EQ term)*'>'                                          # Record
    | term DOT ID                                                                    # RecordProjection
    | '<'term (COMMA term)* '>'                                                      # Tuple
    | term DOT NATURAL_NUMBER                                                        # TupleProjection
    | list_op                                                                        # List
    | 'case' term 'of' '['ID EQ ID ']' '=>' term ('||' '['ID EQ ID ']' '=>' term)*   # CaseOf
    | 'case' term 'of' ('inl'|'inr') ID '=>' term '||' ('inl'|'inr') ID '=>' term    # BinaryCaseOf
    | LPAREN term RPAREN                                                             # Parentheses
    ;

type
    : (GREEK_TYPE | ID | 'Nat' | 'Bool' )                        # GreekType
    | <assoc=right> type ARROW type                              # FunctionType
    | type '+' type                                              # BinaryVariantType
    | '[' ID COLON type (COMMA ID COLON type)* ']'               # VariantType
    | '<' ID COLON type (COMMA ID COLON type)* '>'               # RecordType
    | <assoc=right> type '*' type                                # TupleType
    | 'List ' type                                               # ListType
    | LPAREN type RPAREN                                         # ParenType
    ;

list_op
    : 'nil' '['type']'                 # ListNil
    | 'cons' '['type']' term term       # ListCons
    | 'isnil' '['type']' term           # ListIsNil
    | 'tail' '['type']' term            # ListTail
    | 'head' '['type']' term            # ListHead
    ;

constant
    : NATURAL_NUMBER | '0'
    | 'TRUE'
    | 'true'
    | 'True'
    | 'FALSE'
    | 'false'
    | 'False'
    ;


// Lexer rules
LAMBDA         : 'λ' | '\\y' ;
EQ             : '=';
ID             : [a-zA-Z_][a-zA-Z0-9_]* ;
GREEK_TYPE     : [\u03B1-\u03C9] ;                 // Matches Greek lowercase letters: α (U+03B1) to ω (U+03C9)
NATURAL_NUMBER : [1-9] [0-9]*;
COMMA          : ',';
ARROW          : '->' ;
COLON          : ':' ;
DOT            : '.' ;
SEMI           : ';' ;
LPAREN         : '(' ;
RPAREN         : ')' ;
WS             : [ \t\r\n]+ -> skip ;
