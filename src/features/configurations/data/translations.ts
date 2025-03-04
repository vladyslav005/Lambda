const translations = {
  en: {
    editor: {
      pasteExample: "Paste example",
      pasteExampleMenu: {
        application: "Application",
        variants: "Variants",
        binaryVariants: "Binary variants",
        tuples: "Tuples",
        records: "Records",
        lists: "Lists",
        ifCondition: "If condition",
      }
    },

    helpBar: {
      guides: {
        grammar: {title: "Grammar", desc: "Grammar of language"},
        application: {title: "Application", desc: "Abstraction rule"},
        abstraction: {title: "Abstraction", desc: "Application rule"},
        recordsAndTuples: {title: "Records & Tuples", desc: "Records, tuples, their projections"},
        variants: {title: "Varians", desc: "Varians, case-of construction"},
      },
      searchPlaceholder: "Search topics...",

    },
    tree: {
      treePlaceholder: "Tree will be displayed here",
      exportTexCopy: "Copy to clipboard",
      exportImg: "Download image",
      preview: "Preview",
      width: "Width",
      height: "Height",
      fontColor: "Font color",
      fillColor: "Fill color",
      centerTree: "Center tree",
      showAlias: "Type aliases",
    },

    error: {
      info: "There you'll see the errors"
    },

    conf: {
      interactiveMode: "Run after change",
    },

    toast: {
      editorContentCopy: "Editor content copied to clipboard",
      texCopy: "LaTex code copied to clipboard",
      imgDownload: "Image downloaded",
      exampleCopy: "Example copied to clipboard",
    },

    tutorials: {
      grammar: {
        p1: `The syntax of the language is simple and minimalistic.
          There are two types of expressions: <em>terms</em> and <em>declarations</em>.`,
        p2: `A term can be any of the following: variable, abstraction,
          application, record, tuple, projection, case-of construction,
          if-else construction, variant, or injection.`,
        p3: `Declarations are used to populate the <b>global context &Gamma;</b>.
          Variables can be declared by assigning them a value and explicitly
          specifying their type, or simply by providing a name with a type annotation.
          Example:`,
        p4: `Variables can be used even without assigning them a value,
          since this web application only performs type checking.
          It does not evaluate expressions or consider their values.`,
        p5: `However, while declarations add entries to the context, they are not
          displayed in the proof tree itself. If you paste the example above
          into the editor, an error will occur because there is no actual term
          to display in the proof tree. To resolve this, we need to make a small adjustment:`,
        p6: `  Now, if you paste the updated example, you will see a proof tree
          containing the <em>var rule</em>, which confirms that
          the term <code>var1</code> is correctly typed.
          You can use this approach to write more complex terms.
          It's also possible to write a sequence of unrelated terms
          to see them all in the proof tree. In such cases, they will appear under the <em>sequence rule</em>.`,

      },
      abstraction: {
        p1: `The <em>abstraction rule</em> is used to define functions.
          In simple terms, an abstraction introduces a variable and specifies the
          function’s input type and output type.`,
        p2: `Consider the following function:`,
        p3: `This defines a function <code>id</code> that takes an argument <code>x</code> of type <code>Nat</code>
          and returns <code>x</code>. The type annotation <code>Nat -&gt; Nat</code> means that this function
          takes a natural number and returns a natural number.`,
        p4: `More generally, function abstraction follows this pattern:`,
        p5: `Here, <code>x</code> is a variable of type <code>A</code>, and <code>t</code> is an expression
          that returns a value of type <code>B</code>. The function itself has type <code>A -&gt; B</code>.`,
        p6: `Let's define another function that adds one to a number:`,
        p7: `The abstraction rule ensures that this function is correctly typed:
          it takes a natural number and returns a natural number.`,
        p8: `Try experimenting with different abstractions in the editor to see
          how function definitions work in various cases.`,


      },
      application: {
        p1: `The <em>application rule</em> is used when applying a function to an argument.
          In simple terms, if you have a function and a valid input, the application rule
          checks whether the function can be applied to the given argument.`,
        p2: `Consider the following function:`,
        p3: `Here, <code>id</code> is a function that takes an argument of type <code>Nat</code>
          and returns the same value. Now, let's apply this function to a number:`,
        p4: `When applying <code>id</code> to <code>5</code>, the application rule checks whether
          <code>id</code> expects a <code>Nat</code> and whether <code>5</code> is of type <code>Nat</code>.
          Since both conditions hold, the application is valid.`,
        p5: `More generally, function application follows this pattern:
          <code>(f: A -&gt; B) (x: A) : B;</code>`,
        p6: `That is, if <code>f</code> is a function that takes an argument of type <code>A</code>
          and returns type <code>B</code>, and <code>x</code> is of type <code>A</code>,
          then <code>f x</code> will be of type <code>B</code>.`,
        p7: `Try experimenting with different functions and arguments in the editor to see
          how the application rule applies in various cases.`,

      },
      recordsAndTuples: {
        p1:`  In this tutorial, we'll explore the usage of records,
          tuples, and how to access their values using projections.`,
        p2:`A record is a collection of named fields,
          and a tuple is an ordered collection of values. You can define them as follows:`,
        p3:`In the example above, we define a type <code>Human</code> as a
          record with fields <code>name</code> and <code>age</code>.
          We then create a variable <code>john</code> of type <code>Human</code>
          and access its fields using projections: <code>john.name</code> and <code>john.age</code>.`,
        p4:`Similarly, you can work with tuples, which are represented as an ordered collection of values.
          Here's an example:`,
        p5:`In this case, we define a tuple that combines two variables
          <code>var1</code> and <code>var2</code>.
          You can access the individual elements of the tuple using projections:
          <code>tuple.1</code> for the first element and <code>tuple.2</code> for the second.`,
        p6:`These projections allow you to retrieve specific values from records and tuples,
          enabling you to work with complex data structures in a simple and efficient way.`,

      },
      variants: {
        p1: `Variants are a powerful construct that allow you to represent
          values that can have multiple forms. There are two kinds of variants: <b>binary variants</b>
          and <b>generalized variants</b>.`,
        st1: "Binary Variants",
        p2: `A binary variant can only contain two types and supports two types of injections: <b>left
          injection</b> (<code>inl</code>) and <b>right injection</b> (<code>inr</code>).
          This is a simplified form of variants used to model two distinct possibilities.`,
        p3: `Example:`,
        p4: `In this example, we define two types: <code>PhysicalAddr</code> and <code>VirtualAddr</code>.
          The <code>Addr</code> type is a binary variant that can either be a <code>PhysicalAddr</code>
          or a <code>VirtualAddr</code>. We then create an instance <code>pa</code> of type
          <code>PhysicalAddr</code>, and inject it into the <code>Addr</code> variant using <code>inl</code>.
          The <code>case</code> expression checks which side of the
          variant the value belongs to and extracts the appropriate data.`,
        st2: "Generalized Variants",
        p5: `A generalized variant can contain any number of different types.
          This makes it more flexible and capable of representing a larger range of possibilities.`,
        p6: `Example:`,
        p7: `In this case, the <code>Addr</code> type is a generalized variant defined by a sum of multiple types
          (<code>PhysicalAddr</code> and <code>VirtualAddr</code>).
          The <code>Addr</code> variant can now hold any of these types,
          and the injection is done using a more flexible syntax: <code>[physical = pa]</code>.
          The <code>case</code> expression checks for both possible variants using pattern matching on the keys
          <code>physical</code> and <code>virtual</code>, and extracts the relevant information from the chosen variant.`,
        st3: "Summary",
        p8: ` - <b>Binary variants</b> are limited to two types, where you can inject values using
          either <code>inl</code> (left) or <code>inr</code> (right).<br/>
          - <b>Generalized variants</b> are more flexible, supporting any number of types and using a more structured
          injection syntax with labeled fields.`,
      }
    },

    feedback: "Feedback",
  },

  sk: {
    editor: {
      pasteExample: "Vložiť príklad",
      pasteExampleMenu: {
        application: "Aplikácia",
        variants: "Varianty",
        binaryVariants: "Binárne varianty",
        tuples: "Tuples",
        records: "Záznamy",
        lists: "Zoznamy",
        ifCondition: "Podmienka",
      }
    },

    helpBar: {
      guides: {
        grammar: {title: "Gramatika", desc: "Gramatika jazyka"},
        application: {title: "Aplikácia", desc: "Pravidlo aplikácie"},
        abstraction: {title: "Abstrakcia", desc: "Pravidlo abstrakcie"},
        recordsAndTuples: {title: "Záznamy & súčinové typy", desc: "Záznamy, súčinové typy a ich projekcie"},
        variants: {title: "Varianty", desc: "Varianty a konštrukcia case-of"},
      },
      searchPlaceholder: "Hľadať témy...",
    },

    tree: {
      treePlaceholder: "Tu sa zobrazí strom",
      exportTexCopy: "Kopírovať do schránky",
      exportImg: "Stiahnuť obrázok",
      preview: "Náhľad",
      width: "Šírka",
      height: "Výška",
      fontColor: "Farba písma",
      fillColor: "Farba pozadia",
      centerTree: "Centrovať strom",
      showAlias: "Zobraziť skratky typov",
    },

    error: {
      info: "Tu uvidíte chyby",
    },

    conf: {
      interactiveMode: "Spustiť po zmene",
    },

    toast: {
      editorContentCopy: "Obsah editora skopírovaný do schránky",
      texCopy: "LaTeX kód skopírovaný do schránky",
      imgDownload: "Obrázok bol stiahnutý",
      exampleCopy: "Príklad skopírovaný do schránky",
    },

    tutorials: {
      grammar: {
        p1: `Syntax jazyka je jednoduchá a minimalistická.
        Existujú dva typy výrazov: <em>termy</em> a <em>deklarácie</em>.`,
        p2: `Term môže byť ktorýmkoľvek z nasledujúcich: premenná, abstrakcia,
        aplikácia, záznam, súčinový typ, projekcia, konštrukcia case-of,
        konštrukcia if-else, variant alebo injekcia.`,
        p3: `Deklarácie sa používajú na naplnenie <b>globálneho kontextu &Gamma;</b>.
        Premenné môžu byť deklarované priradením hodnoty a explicitnou
        typovou anotáciou, alebo jednoducho poskytnutím názvu s typovou anotáciou.
        Príklad:`,
        p4: `Premenné môžu byť použité aj bez priradenia hodnoty,
        pretože táto webová aplikácia vykonáva iba kontrolu typov.
        Nevykonáva vyhodnocovanie výrazov ani neberie do úvahy ich hodnoty.`,
        p5: `Avšak, zatiaľ čo deklarácie pridávajú položky do kontextu, nie sú
        zobrazované priamo v dôkazovom strome. Ak vložite vyššie uvedený príklad
        do editora, dôjde k chybe, pretože nie je tam žiadny term,
        ktorý by sa mohol v dôkazovom strome zobraziť. Na vyriešenie tohto problému musíme úpraviť 
        kód nasledujúcim spôsobom:`,
        p6: `Teraz, ak vložite aktualizovaný príklad, uvidíte dôkazový strom,
        ktorý obsahuje <em>var rule</em>, čo potvrdzuje, že
        term <code>var1</code> je správne typovaný.
        Môžete použiť tento prístup na zápis zložitejších termov.
        Je tiež možné napísať sekvenciu nesúvisiacich termov,
        aby sa zobrazili všetky v dôkazovom strome. V takom prípade sa zobrazia v pravidle <em>sequence rule</em>.`,
      },
      abstraction: {
        p1: `Abstrakcia pravidlo sa používa na definovanie funkcií.
        Jednoducho povedané, abstrakcia zavádza premennú a špecifikuje
        vstupný a výstupný typ.`,
        p2: `Pozrieme sa na nasledujúcu funkciu:`,
        p3: `Táto funkcia <code>id</code> prijíma argument <code>x</code> typu <code>Nat</code>
        a vracia <code>x</code>. Typová anotácia <code>Nat -&gt; Nat</code> znamená, že táto funkcia
        prijíma prirodzené číslo a vracia prirodzené číslo.`,
        p4: `Vo všeobecnosti abstrakcia nasleduje tento vzor:`,
        p5: `Tu je <code>x</code> premenná typu <code>A</code> a <code>t</code> je výraz,
        ktorý vracia hodnotu typu <code>B</code>. Samotná funkcia má typ <code>A -&gt; B</code>.`,
        p6: `Definujme ďalšiu funkciu, ktorá pripočíta k číslu hodnotu 1:`,
        p7: `Abstrakcia zabezpečuje, že táto funkcia je správne typovaná:
        prijíma prirodzené číslo a vracia prirodzené číslo.`,
        p8: `Vyskúšajte rôzne abstrakcie v editore, aby ste videli,
        ako fungujú definície funkcií v rôznych prípadoch.`,
      },
      application: {
        p1: `<em>Pravidlo aplikácie</em> sa používa pri aplikovaní funkcie na argument.
        Ak máme funkciu a platný vstup, pravidlo aplikácie
        skontroluje, či je možné funkciu použiť na daný argument.`,
        p2: `Pozrime sa na nasledujúcu funkciu:`,
        p3: `Tu je <code>id</code> funkcia, ktorá prijíma argument typu <code>Nat</code>
        a vracia rovnakú hodnotu. Teraz aplikujeme túto funkciu na číslo:`,
        p4: `Pri aplikovaní <code>id</code> na <code>5</code> pravidlo aplikácie skontroluje, či
        <code>id</code> očakáva <code>Nat</code> a či <code>5</code> má typ <code>Nat</code>.
        Keďže obe podmienky sú splnené, aplikácia je platná.`,
        p5: `Vo všeobecnosti aplikácia funkcie vyzerá takto:
        <code>(f: A -&gt; B) (x: A) : B;</code>`,
        p6: `Teda, ak je <code>f</code> funkcia, ktorá prijíma argument typu <code>A</code>
        a vracia typ <code>B</code>, a <code>x</code> je typu <code>A</code>,
        potom <code>f x</code> bude typu <code>B</code>.`,
        p7: `Vyskúšajte si v editore rôzne funkcie a argumenty, aby ste videli,
        ako sa pravidlo aplikácie uplatňuje v rôznych prípadoch.`,
      },
      recordsAndTuples: {
        p1: `V tomto návode preskúmame použitie záznamov,
        súčinových typov a spôsob, ako pristupovať k ich hodnotám pomocou projekcií.`,
        p2: `Záznam je množina pomenovaných prvkov, súčinový typ je usporiadaná množina prvkov. Môžete ich definovať takto:`,
        p3: `V príklade vyššie definujeme typ <code>Human</code> ako
        záznam s poľami <code>name</code> a <code>age</code>.
        Potom vytvoríme premennú <code>john</code> typu <code>Human</code>
        a pristupujeme k jej prvkom pomocou projekcií: <code>john.name</code> a <code>john.age</code>.`,
        p4: `Podobne môžete pracovať so súčinovými typmi.
        Tu je príklad:`,
        p5: `V tomto prípade definujeme súčinový typ, ktorý kombinuje dve premenné
        <code>var1</code> a <code>var2</code>.
        K jednotlivým prvkom súčinového typu môžete pristupovať pomocou projekcií:
        <code>pair.1</code> pre prvý prvok a <code>pair.2</code> pre druhý.`,
        p6: `Tieto projekcie vám umožňujú získať konkrétne hodnoty zo záznamov a súčinových typov,
        čo umožňuje pracovať so zložitými dátovými štruktúrami jednoducho a efektívne.`,
      },
      variants: {
        p1: `Varianty sú výkonný konštrukt, ktorý vám umožňuje reprezentovať
        hodnoty, ktoré môžu mať viacero foriem. Táto aplikácia podporuje dva druhy variantov: <b>binárne varianty</b>
        a <b>zovšeobecnené varianty</b>.`,
        st1: "Binárne varianty",
        p2: `Binárny variant môže obsahovať len dva typy a podporuje len dve injekcií: <b>ľavú injekciu</b> (<code>inl</code>) a <b>pravú injekciu</b> (<code>inr</code>).
        Tento jednoduchý variant sa používa na modelovanie dvoch možností.`,
        p3: `Príklad:`,
        p4: `V tomto príklade definujeme dva typy: <code>PhysicalAddr</code> a <code>VirtualAddr</code>.
        Typ <code>Addr</code> je binárny variant, ktorý môže byť buď <code>PhysicalAddr</code>,
        alebo <code>VirtualAddr</code>. Potom vytvoríme inštanciu <code>pa</code> typu
        <code>PhysicalAddr</code> a vložíme ju do variantu <code>Addr</code> pomocou <code>inl</code>.
        Výraz <code>case</code> skontroluje, do ktorého variantu hodnota patrí, a extrahuje príslušné údaje.`,
        st2: "Zovšeobecnené varianty",
        p5: `Zovšeobecnený variant môže obsahovať ľubovoľný počet rôznych typov.
        To ho robí flexibilnejším a schopným reprezentovať širší rozsah možností.`,
        p6: `Príklad:`,
        p7: `V tomto prípade je typ <code>Addr</code> zovšeobecnený variant definovaný ako súčet viacerých typov
        (<code>PhysicalAddr</code> a <code>VirtualAddr</code>).
        Variant <code>Addr</code> teraz môže obsahovať ktorýkoľvek z týchto typov,
        a injekcia sa vykonáva pomocou štruktúrovanejšej syntaxe: <code>[physical = pa]</code>.
        Výraz <code>case</code> kontroluje obe možné varianty pomocou návestí 
        <code>physical</code> a <code>virtual</code> a extrahuje príslušné informácie.`,
        st3: "Zhrnutie",
        p8: ` - <b>Binárne varianty</b> sú obmedzené na dva typy, pričom hodnoty môžete vkladať pomocou injekcí:
        <code>inl</code> (ľavá) alebo <code>inr</code> (pravá).<br/>
        - <b>Zovšeobecnené varianty</b> sú flexibilnejšie, podporujú ľubovoľný počet typov a používajú štruktúrovanú
        syntax s pomenovanými prvkámi.`,
      },
    },

    feedback: "Spätná väzba",

  },
}

export default translations