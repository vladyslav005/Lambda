grammar LambdaCalc;

expression
    : ( globalDecl )* terms  EOF              # Expr
    ;

terms
    : (seqTerm=term SEMI)* seqTerm=term COLON type (SEMI)? # Sequence
    ;

globalDecl
    : 'typedef' ID EQ type SEMI               # TypeAlias
    | ID COLON type SEMI                      # GlobalVariableDeclaration
    | ID EQ term (COLON type)? SEMI              # GlobalFunctionDeclaration
    ;

term
    : <assoc=left> term term                                                         # Application
    | term ('>'|'>='|'<'|'<='|'==') term                                             # Comparison
    | term ('+'|'-') term                                                            # Addition
    | term ('*') term                                                                # Multiplication
    | term ('^') term                                                                # Power
    | LAMBDA ID COLON type DOT term                                                  # LambdaAbstraction
    | LAMBDA '_' COLON type DOT term                                                 # WildCard
    | 'if' term 'then' term ('else if' term 'then' term)* ('else' term)?             # IfElse
    | ID                                                                             # Variable
    | 'fix' term                                                                     # Fix
    | constant                                                                       # Literal
    | '['ID EQ term']' 'as' type                                                     # Injection
    | ('inl'|'inr') term 'as' type                                                   # LeftRightInj
    | '<' ID EQ term (COMMA ID EQ term)*'>'                                          # Record
    | '<'term (COMMA term)* '>'                                                      # Tuple
    | term DOT ID                                                                    # RecordProjection
    | term DOT NATURAL_NUMBER                                                        # TupleProjection
    | list_op                                                                        # List
    | 'case' term 'of' '['ID EQ ID ']' DOUBLEARROW term ('||' '['ID EQ ID ']' DOUBLEARROW term)*   # CaseOf
    | 'case' term 'of' ('inl'|'inr') ID DOUBLEARROW term '||' ('inl'|'inr') ID DOUBLEARROW term    # BinaryCaseOf
    | LPAREN term RPAREN                                                             # Parentheses
    ;

type
    : (GREEK_TYPE | ID | 'Nat' | 'Bool' | 'Unit')                # GreekType
    | 'List ' type                                               # ListType
    | '<' ID COLON type (COMMA ID COLON type)* '>'               # RecordType
    | <assoc=right> type '*' type                                # TupleType
    | type '+' type                                              # BinaryVariantType
    | '[' ID COLON type (COMMA ID COLON type)* ']'               # VariantType
    | <assoc=right> type ARROW type                              # FunctionType
    | LPAREN type RPAREN                                         # ParenType
    ;

list_op
    : NIL LBRACK type RBRACK                # ListNil
    | CONS LBRACK type RBRACK               # ListCons
    | ISNIL LBRACK type RBRACK              # ListIsNil
    | TAIL LBRACK type RBRACK               # ListTail
    | HEAD LBRACK type RBRACK               # ListHead
    | LBRACK (term (COMMA term)* ) RBRACK   # ListConstructor
    ;

constant
    : NATURAL_NUMBER | '0'
    | 'true'
    | 'True'
    | 'false'
    | 'False'
    | 'Unit'
    | 'unit'
    ;


// Lexer rules

LAMBDA         : 'λ' | '\\y' ;
EQ             : '=';
NIL   : 'nil';
CONS  : 'cons';
ISNIL : 'isnil';
TAIL  : 'tail';
HEAD  : 'head';

LBRACK : '[';
RBRACK : ']';
ID             : [a-zA-Z_][a-zA-Z0-9_]* ;
GREEK_TYPE     : [\u03B1-\u03C9] ;                 // Matches Greek lowercase letters: α (U+03B1) to ω (U+03C9)
NATURAL_NUMBER : [1-9] [0-9]*;
COMMA          : ',';
ARROW          : '->' | '→';
DOUBLEARROW    : '=>' | '⇒';
COLON          : ':' ;
DOT            : '.' ;
SEMI           : ';' ;
LPAREN         : '(' ;
RPAREN         : ')' ;

WS             : [ \t\r\n]+ -> skip ;