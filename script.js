// Default dummy data
const defaultData = {
    columns: ['Name', 'Age', 'Score'],
    index: [0, 1, 2, 3],
    data: [
        ['Alice', 25, 85],
        ['Bob', 30, 90],
        ['Charlie', 35, 95],
        ['David', 40, 80]
    ]
};

// State
let currentTopic = 'basics';
let currentData = JSON.parse(JSON.stringify(defaultData)); 
let isDarkTheme = true;

// DOM Elements
const tableContainer = document.getElementById('table-container');
const actionButtons = document.getElementById('action-buttons');
const codeSnippet = document.getElementById('code-snippet');
const topicTitle = document.getElementById('topic-title');
const topicDoc = document.getElementById('topic-description');
const navItems = document.querySelectorAll('.nav-item');
const themeToggle = document.getElementById('theme-toggle');
const actionConsole = document.getElementById('action-console');
const consoleSyntax = document.getElementById('console-syntax');
const consoleOutput = document.getElementById('console-output');

// Topic Definitions
const topicsInfo = {
    basics: {
        title: "DataFrame Basics & Creation",
        desc: "A DataFrame is a 2-dimensional labeled data structure with columns of potentially different types.",
        code: `# 1. Dictionary of Lists (Default)\ndf = pd.DataFrame({'Name': ['Alice', 'Bob'], 'Age': [25, 30]})\n\n# 2. List of Lists\ndf = pd.DataFrame([['Alice', 25], ['Bob', 30]], columns=['Name', 'Age'])\n\n# 3. List of Dictionaries\ndf = pd.DataFrame([{'Name': 'Alice', 'Age': 25}, {'Name': 'Bob', 'Age': 30}])\n\n# 4. Dictionary of Dictionaries\ndf = pd.DataFrame({'Row1': {'Name': 'A', 'Age': 1}, 'Row2': {'Name': 'B', 'Age': 2}}).T`,
        buttons: [
            { label: "Create: Dict of Lists", action: "createDictOfLists", class: "primary" },
            { label: "Create: List of Lists", action: "createListOfLists", class: "primary" },
            { label: "Create: List of Dicts", action: "createListOfDicts", class: "primary" },
            { label: "Create: Dict of Dicts", action: "createDictOfDicts", class: "primary" },
            { label: "df.head(2)", action: "showHead", class: "" },
            { label: "df.tail(1)", action: "showTail", class: "" },
            { label: "Reset Default", action: "resetData", class: "warning" }
        ]
    },
    attributes: {
        title: "DataFrame Attributes",
        desc: "Attributes provide metadata about the DataFrame (shape, size, ndim, empty, dtypes, ...).",
        code: `# View DataFrame Metadata\nprint(df.shape)\nprint(df.size)\nprint(df.ndim)\nprint(df.empty)\nprint(df.dtypes)\nprint(df.isna().any()) # Check for NaNs`,
        buttons: [
            { label: "df.shape (Pulse All)", action: "pulseShape", class: "primary" },
            { label: "df.size (Total Elements)", action: "showSize", class: "" },
            { label: "df.ndim (Dimensions)", action: "showNdim", class: "" },
            { label: "df.dtypes (Data Types)", action: "showDtypes", class: "" },
            { label: "df.empty (Is it empty?)", action: "showEmpty", class: "" },
            { label: "df.isna().any() (Has NaN?)", action: "showHasNan", class: "" },
            { label: "df.columns (Highlight)", action: "pulseColumns", class: "" },
            { label: "df.index (Highlight)", action: "pulseIndex", class: "" }
        ]
    },
    modifications: {
        title: "DataFrame Modifications",
        code: `# Manipulating Data\ndf = df.sort_values(by='Score', ascending=False)\ndf = df.rename(columns={'Name': 'Student'}) # Rename column\ndf.reindex([2, 0, 3]) # Reindex rows\ndf = df.drop(index=1) # Drop Bob\ndf = df.T # Transpose DataFrame\ndf['Grade'] = ['B', 'A', 'A', 'C'] # Add new column\n# Missing Data\ndf = df.fillna(0) # Replace NaNs with 0\ndf = df.dropna() # Drop rows with NaNs\n# Advanced conditional assignment\nimport numpy as np\ndf['Result'] = np.where((df['Score'] > 90) & (df['Age'] > 25), 'Pass', 'Fail')`,
        buttons: [
            { label: "df['Grade'] = ... (Add Col)", action: "addColumn", class: "success" },
            { label: "np.where(Score>90 & Age>25)", action: "npWhereAssign", class: "success" },
            { label: "df.reindex([2, 0, 3])", action: "reindexData", class: "primary" },
            { label: "df.fillna(0)", action: "fillNaData", class: "warning" },
            { label: "df.dropna()", action: "dropNaData", class: "danger" },
            { label: "Rename 'Name' to 'Student'", action: "renameCol", class: "warning" },
            { label: "df.T (Transpose)", action: "transposeData", class: "" },
            { label: "Sort by Score (Desc)", action: "sortScore", class: "" },
            { label: "Drop Row 1 (Bob)", action: "dropRow", class: "danger" },
            { label: "Reset DataFrame", action: "resetData", class: "" }
        ]
    },
    selection: {
        title: "Selection & Access",
        desc: "Access specific rows, columns, or cells using bracket notation, loc (label-based), and iloc (index-based).",
        code: `# Accessing Data\nnames = df['Name'] # Single column\nsubset = df[['Name', 'Score']] # Multiple columns\nrow = df.loc[0] # Row by label\nslice = df.iloc[0:2] # Rows 0 and 1 by integer location`,
        buttons: [
            { label: "df['Name'] (Column)", action: "selectColumn", class: "primary" },
            { label: "df[['Name', 'Score']]", action: "selectMultiColumns", class: "" },
            { label: "df.loc[0] (Label)", action: "showLoc", class: "" },
            { label: "df.iloc[0:2] (Slice)", action: "showIloc", class: "" }
        ]
    },
    filtering: {
        title: "Filtering & Conditions",
        desc: "Keep rows matching a condition (df[condition]) or drop rows based on a condition.",
        code: `# 1. Keep only rows NOT equal to 90
df = df[df['Score'] != 90]

# 2. Keep rows where Score >= 90 AND Age > 25
df_filtered = df[(df['Score'] >= 90) & (df['Age'] > 25)]

# 3. Remove rows where Score == 90
df.drop(df[df['Score'] == 90].index)

# 4. Complex Drop: Any Score < 90 OR Mean Score < 95
cols = [c for c in ['Score'] if (df[c] < 90).any() | (df[c].mean() < 95)]
df = df.drop(columns=cols)`,
        buttons: [
            { label: "Keep if Score != 90", action: "keepScoreNot90", class: "primary" },
            { label: "Keep Score>=90 & Age>25", action: "multiConditionFilter", class: "primary" },
            { label: "Drop if Score == 90", action: "dropScoreEq90", class: "danger" },
            { label: "Complex Col Drop", action: "complexColDrop", class: "warning" },
            { label: "Reset DataFrame", action: "resetData", class: "" }
        ]
    },
    transfer: {
        title: "CSV Data Transfer",
        desc: "Load data from CSV files using important attributes like nrows, header, index_col, skiprows, usecols, and names.",
        code: `# 1. Read specific columns and limit rows
df = pd.read_csv('data.csv', usecols=['Name', 'Score'], nrows=100)

# 2. Skip initial rows and rename columns (ignoring original header)
df = pd.read_csv('data.csv', skiprows=2, names=['Col1', 'Col2'], header=0)

# 3. Set a specific column as the DataFrame index
df = pd.read_csv('data.csv', index_col='ID')

# 4. Write to CSV without exporting the row index
df.to_csv('backup.csv', index=False)`,
        buttons: [
            { label: "df.to_csv()", action: "animateCSVWrite", class: "success" },
            { label: "nrows=2", action: "csvReadNrows", class: "primary" },
            { label: "skiprows=1", action: "csvReadSkiprows", class: "primary" },
            { label: "usecols=['Name', 'Score']", action: "csvReadUsecols", class: "primary" },
            { label: "header=0, names=[...]", action: "csvReadNames", class: "primary" },
            { label: "index_col='Name'", action: "csvReadIndexCol", class: "primary" },
            { label: "Reset Initial", action: "resetData", class: "warning" }
        ]
    },
    iteration: {
        title: "DataFrame Iteration",
        desc: "Iterate over rows or columns using iterrows(), itertuples(), or items().",
        code: `# Iterating over rows\nfor index, row in df.iterrows():\n    print(f"Index: {index}, Name: {row['Name']}")\n\n# Iterating over columns\nfor col_name, col_data in df.items():\n    ...`,
        buttons: [
            { label: "df.iterrows()", action: "animateIterRows", class: "primary" },
            { label: "df.items() (Columns)", action: "animateIterCols", class: "warning" }
        ]
    }
};

// Core Functions
function setTopic(topic) {
    currentTopic = topic;
    
    const mainControls = document.getElementById('main-controls');
    const mainVis = document.getElementById('main-visualization');
    const quizContainer = document.getElementById('quiz-container');

    if (topic === 'quiz') {
        if(mainControls) mainControls.style.display = 'none';
        if(mainVis) mainVis.style.display = 'none';
        if(quizContainer) quizContainer.style.display = 'flex';
        
        topicTitle.textContent = "Practice Quiz";
        topicDoc.textContent = "Test your Pandas knowledge by answering 5 randomly selected questions.";
        startQuiz();
        return;
    } else {
        if(mainControls) mainControls.style.display = 'flex';
        if(mainVis) mainVis.style.display = 'flex';
        if(quizContainer) quizContainer.style.display = 'none';
    }

    const info = topicsInfo[topic];
    if (!info) return;

    topicTitle.textContent = info.title;
    topicDoc.textContent = info.desc;
    
    // Format code block
    if (info.syntaxHTML) {
        codeSnippet.innerHTML = info.syntaxHTML;
        codeSnippet.classList.add('has-rich-syntax');
    } else {
        codeSnippet.innerHTML = `<code>${info.code.replace(/\\n/g, '<br>').replace(/ /g, '&nbsp;')}</code>`;
        codeSnippet.classList.remove('has-rich-syntax');
    }
    
    // Render Buttons
    actionButtons.innerHTML = '';
    info.buttons.forEach((btn, idx) => {
        const button = document.createElement('button');
        button.className = 'action-btn';
        // Give the first button an active-btn class by default in this context if desired, or let clicks handle it
        if(idx === 0) button.classList.add('active-btn-style');
        
        button.textContent = btn.label;
        button.innerHTML += ` <span>▶</span>`;
        
        // Use an anonymous function to call the specific action from the registry
        button.onclick = (e) => {
            // Remove active style from all action buttons
            document.querySelectorAll('.action-btn').forEach(b => b.classList.remove('active-btn-style'));
            e.currentTarget.classList.add('active-btn-style');
            actionRegistry[btn.action]();
        };
        actionButtons.appendChild(button);
    });

    // Reset data
    resetData();
}

function renderTable(dataObj = currentData, animate = true) {
    if(!dataObj || !dataObj.columns) return;
    
    const rows = dataObj.data.length;
    const cols = dataObj.columns.length + 1; // +1 for index

    const dfDiv = document.createElement('div');
    dfDiv.className = 'dataframe';
    if(animate) dfDiv.classList.add('anim-slide-in');
    dfDiv.style.gridTemplateColumns = `auto repeat(${dataObj.columns.length}, 1fr)`;

    // Headers
    dfDiv.appendChild(createCell('', 'df-cell df-header')); // Empty top-left
    dataObj.columns.forEach((col, cIdx) => {
        dfDiv.appendChild(createCell(col, 'df-cell df-header', `col-${cIdx}`));
    });

    // Data Rows
    dataObj.data.forEach((row, rIdx) => {
        // Index cell
        dfDiv.appendChild(createCell(dataObj.index[rIdx], 'df-cell df-index', `idx-${dataObj.index[rIdx]}`));
        // Data cells
        row.forEach((val, cIdx) => {
            dfDiv.appendChild(createCell(val, 'df-cell', `cell-${dataObj.index[rIdx]}-${cIdx}`));
        });
    });

    tableContainer.innerHTML = '';
    tableContainer.appendChild(dfDiv);
}

function createCell(content, className, id = '') {
    const div = document.createElement('div');
    div.className = className;
    div.innerHTML = content;
    if(id) div.id = id;
    return div;
}

function resetData() {
    currentData = JSON.parse(JSON.stringify(defaultData));
    if(actionConsole) actionConsole.classList.remove('visible');
    renderTable();
}

function showConsole(syntax, output, richHTML = null) {
    if(!actionConsole) return;
    actionConsole.classList.remove('visible');
    
    // trigger reflow to reset animation
    void actionConsole.offsetWidth;
    
    // Always update the python terminal text
    consoleSyntax.textContent = syntax || '';
    consoleOutput.textContent = output || '';

    // Handle Rich Syntax Overlay below the terminal
    const richSyntaxOutput = document.getElementById('rich-syntax-output');
    if (richSyntaxOutput) {
        if (richHTML) {
            richSyntaxOutput.innerHTML = richHTML;
            richSyntaxOutput.style.display = 'block';
        } else {
            richSyntaxOutput.style.display = 'none';
            richSyntaxOutput.innerHTML = '';
        }
    }
    
    // Show the console
    actionConsole.classList.add('visible');
}

// === Action Functions for the Buttons ===

// === Action Functions for the Buttons ===

const actionRegistry = {
    renderTable: () => {
        showConsole("df = pd.DataFrame(data)", "=> DataFrame successfully created in memory.");
        renderTable();
    },

    createDictOfLists: () => {
        currentData = {
            columns: ['Name', 'Age'],
            index: [0, 1],
            data: [['Alice', 25], ['Bob', 30]]
        };
        showConsole("df = pd.DataFrame({'Name': ['Alice', 'Bob'], 'Age': [25, 30]})", "=> DataFrame created from Dictionary of Lists");
        renderTable();
    },

    createListOfLists: () => {
        currentData = {
            columns: ['Name', 'Age'],
            index: [0, 1],
            data: [['Alice', 25], ['Bob', 30]]
        };
        showConsole("df = pd.DataFrame([['Alice', 25], ['Bob', 30]], columns=['Name', 'Age'])", "=> DataFrame created from List of Lists");
        renderTable();
    },

    createListOfDicts: () => {
        currentData = {
            columns: ['Name', 'Age'],
            index: [0, 1],
            data: [['Alice', 25], ['Bob', 30]]
        };
        showConsole("df = pd.DataFrame([{'Name': 'Alice', 'Age': 25}, {'Name': 'Bob', 'Age': 30}])", "=> DataFrame created from List of Dictionaries");
        renderTable();
    },

    createDictOfDicts: () => {
        currentData = {
            columns: ['Name', 'Age'],
            index: ['Row1', 'Row2'],
            data: [['A', 1], ['B', 2]]
        };
        showConsole("df = pd.DataFrame({'Row1': {'Name': 'A', 'Age': 1}, 'Row2': {'Name': 'B', 'Age': 2}}).T", "=> DataFrame created from transposed Dictionary of Dictionaries");
        renderTable();
    },

    showHead: () => {
        showConsole("df.head(2)", "      Name  Age  Score\n0    Alice   25     85\n1      Bob   30     90");
        const headData = JSON.parse(JSON.stringify(currentData));
        headData.data = headData.data.slice(0, 2);
        headData.index = headData.index.slice(0, 2);
        renderTable(headData);
    },

    showTail: () => {
        showConsole("df.tail(1)", "      Name  Age  Score\n3    David   40     80");
        const tailData = JSON.parse(JSON.stringify(currentData));
        tailData.data = tailData.data.slice(-1);
        tailData.index = tailData.index.slice(-1);
        renderTable(tailData);
    },

    pulseShape: () => {
        showConsole("df.shape", `=> (${currentData.index.length}, ${currentData.columns.length})    # ${currentData.index.length} Rows, ${currentData.columns.length} Columns`);
        renderTable(); // ensure full table
        setTimeout(() => {
            const cells = document.querySelectorAll('.df-cell');
            cells.forEach(c => {
                c.classList.remove('anim-highlight');
                void c.offsetWidth; // trigger reflow
                c.classList.add('anim-highlight');
            });
        }, 50);
    },

    showSize: () => {
        const totalElements = currentData.index.length * currentData.columns.length;
        showConsole("df.size", `=> ${totalElements}    # Total number of elements in DataFrame`);
        renderTable(); 
        setTimeout(() => {
            const cells = document.querySelectorAll('.df-cell');
            cells.forEach((c, idx) => {
                c.classList.remove('anim-highlight');
                void c.offsetWidth;
                c.style.animationDelay = `${idx * 30}ms`; // cascade effect
                c.classList.add('anim-highlight');
            });
            // Cleanup delay
            setTimeout(() => {
                cells.forEach(c => c.style.animationDelay = '0ms');
            }, cells.length * 30 + 1000);
        }, 50);
    },

    showNdim: () => {
        showConsole("df.ndim", "=> 2    # DataFrame is a 2D data structure");
        renderTable();
        setTimeout(() => {
            const headers = document.querySelectorAll('.df-header');
            const indices = document.querySelectorAll('.df-index');
            
            headers.forEach(h => {
                h.classList.remove('anim-highlight');
                void h.offsetWidth;
                h.style.animation = 'renameHighlight 1s ease'; // repurpose animation manually
            });
            
            setTimeout(() => {
                indices.forEach(i => {
                    i.classList.remove('anim-highlight');
                    void i.offsetWidth;
                    i.style.animation = 'renameHighlight 1s ease';
                });
            }, 600); // offset the second dimension slightly
        }, 50);
    },
    
    showEmpty: () => {
        const isEmpty = currentData.data.length === 0;
        showConsole("df.empty", `=> ${isEmpty ? 'True' : 'False'}`);
        renderTable();
        setTimeout(() => {
            const table = document.querySelector('.dataframe');
            if (table) {
                table.style.animation = 'none';
                void table.offsetWidth;
                table.style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both';
            }
        }, 50);
    },

    showDtypes: () => {
        showConsole("df.dtypes", "Name      object\nAge        int64\nScore      int64\ndtype: object");
        renderTable();
        setTimeout(() => {
            const headers = document.querySelectorAll('.df-header');
            headers.forEach((h, i) => {
                // Ignore the empty index corner
                if(h.textContent.trim() === '') return;
                
                h.style.position = 'relative';
                const dtypeLabel = document.createElement('div');
                dtypeLabel.className = 'dtype-tooltip';
                
                // Very basic guess based on first row
                let dtype = 'object';
                if(currentData.data.length > 0) {
                    const val = currentData.data[0][i-1]; // offset by 1 because of index column
                    if(typeof val === 'number') dtype = 'int64';
                }
                
                dtypeLabel.textContent = dtype;
                h.appendChild(dtypeLabel);
                
                h.classList.remove('anim-highlight');
                void h.offsetWidth;
                h.classList.add('anim-highlight');
                
                setTimeout(() => {
                    if (h.contains(dtypeLabel)) h.removeChild(dtypeLabel);
                }, 2000); // clear tooltip after 2 seconds
            });
        }, 50);
    },

    showHasNan: () => {
        showConsole("df.isna().any()", "Name     False\nAge      False\nScore    False\ndtype: bool");
        renderTable();
        setTimeout(() => {
            let hasNan = false;
            const cells = document.querySelectorAll('.df-cell');
            cells.forEach(c => {
                if (c.textContent === 'NaN' || c.textContent === '') {
                    hasNan = true;
                    c.style.animation = 'none';
                    void c.offsetWidth;
                    c.style.animation = 'highlightPulse 1.5s infinite'; // pulsing constantly for a bit
                    setTimeout(() => { c.style.animation = ''; }, 3000);
                }
            });
            
            if (!hasNan) {
                // Quick flash green to show everything is valid
                const table = document.querySelector('.dataframe');
                if (table) {
                    table.style.boxShadow = '0 0 30px var(--accent-success)';
                    setTimeout(() => {
                        table.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
                    }, 1000);
                }
            }
        }, 50);
    },

    pulseColumns: () => {
        showConsole("df.columns", "=> Index(['Name', 'Age', 'Score'], dtype='object')");
        const headers = document.querySelectorAll('.df-header');
        headers.forEach(h => {
            h.classList.remove('anim-highlight');
            void h.offsetWidth;
            h.classList.add('anim-highlight');
        });
    },

    pulseIndex: () => {
        showConsole("df.index", "=> RangeIndex(start=0, stop=4, step=1)");
        const indices = document.querySelectorAll('.df-index');
        indices.forEach(i => {
            i.classList.remove('anim-highlight');
            void i.offsetWidth;
            i.classList.add('anim-highlight');
        });
    },

    sortScore: () => {
        showConsole("df.sort_values(by='Score', ascending=False)", "=> Visual table updated (sorted descending by Score)");
        
        let scoreIndex = currentData.columns.indexOf('Score');
        if (scoreIndex === -1) scoreIndex = 2; // fallback

        const combined = currentData.data.map((row, i) => ({ row, idx: currentData.index[i] }));
        combined.sort((a, b) => b.row[scoreIndex] - a.row[scoreIndex]);
        
        currentData.data = combined.map(c => c.row);
        currentData.index = combined.map(c => c.idx);
        
        tableContainer.innerHTML = '<div class="placeholder-text">Sorting...</div>';
        setTimeout(() => renderTable(), 300);
    },

    renameCol: () => {
        showConsole("df.rename(columns={'Name': 'Student'})", "=> Visual table updated (Name -> Student)");
        const nameIdx = currentData.columns.indexOf('Name');
        if(nameIdx > -1) {
            currentData.columns[nameIdx] = 'Student';
            renderTable(currentData, false);
            const colCell = document.getElementById(`col-${nameIdx}`);
            if(colCell) colCell.classList.add('anim-rename');
        }
    },

    transposeData: () => {
        showConsole("df.T", "=> DataFrame is transposed (rows become columns, columns become rows)");
        
        // Save current table state
        const oldData = currentData.data;
        const oldCols = currentData.columns;
        const oldIdx = currentData.index;

        // Create new structures
        const newCols = oldIdx.map(String);
        const newIdx = oldCols;
        const newData = [];

        // Transpose the 2D array
        for(let c = 0; c < oldCols.length; c++) {
            const newRow = [];
            for(let r = 0; r < oldData.length; r++) {
                newRow.push(oldData[r][c]);
            }
            newData.push(newRow);
        }

        currentData = {
            columns: newCols,
            index: newIdx,
            data: newData
        };

        tableContainer.innerHTML = '<div class="placeholder-text">Transposing...</div>';
        setTimeout(() => renderTable(), 400);
    },

    dropRow: () => {
        showConsole("df.drop(index=1)", "=> Visual table updated (Dropped Index 1: Bob)");
        // Find Bob (index 1)
        const idxIndex = currentData.index.indexOf(1);
        if(idxIndex > -1) {
            // Ghosting phase
            const rowCells = document.querySelectorAll(`[id^="idx-1"], [id^="cell-1-"]`);
            rowCells.forEach(cell => {
                cell.classList.add('ghosted-element');
            });
            
            setTimeout(() => {
                // Animate out
                rowCells.forEach(cell => {
                    cell.style.animation = 'dropRow 0.6s forwards cubic-bezier(0.55, 0.085, 0.68, 0.53)';
                });
                
                // Remove from data source after animation
                setTimeout(() => {
                    currentData.data.splice(idxIndex, 1);
                    currentData.index.splice(idxIndex, 1);
                    renderTable(currentData, false);
                }, 600);
            }, 1200); // 1.2s delay for ghosting
        }
    },

    resetData: () => {
        showConsole("df = original_df.copy()", "=> DataFrame reset back to initial state.");
        resetData();
    },

    animateCSVRead: () => {
        showConsole("pd.read_csv('students.csv')", "=> Loading data line by line...");
        tableContainer.innerHTML = '<div style="text-align:center; font-family:monospace; color:var(--text-muted); font-size:1.2rem; transform: translateY(-50px); animation: slideInUp 0.5s forwards;">Reading students.csv...<br><br>Name,Age,Score<br>Alice,25,85<br>Bob,30,90<br>...</div>';
        setTimeout(() => {
            resetData();
        }, 1500);
    },

    animateCSVWrite: () => {
        showConsole("df.to_csv('backup.csv', index=False)", "=> Exporting DataFrame into CSV format...");
        renderTable();
        setTimeout(() => {
            const df = document.querySelector('.dataframe');
            if(df) {
                df.style.transform = 'scale(0.8) translateY(100px)';
                df.style.opacity = '0';
                setTimeout(() => {
                    tableContainer.innerHTML = '<div style="font-family:monospace; color:var(--accent-success); font-size:1.2rem; animation: slideInUp 0.5s forwards;">✅ Successfully exported to backup.csv</div>';
                }, 500);
            }
        }, 500);
    },

    animateIterRows: () => {
        showConsole("for index, row in df.iterrows():", "=> Yields (index, Series) pairs iteratively...");
        renderTable();
        // Dim all cells
        const allCells = document.querySelectorAll('.df-cell');
        allCells.forEach(c => c.style.opacity = '0.4');

        currentData.index.forEach((idx, i) => {
            setTimeout(() => {
                // Update Console Output line per iteration
                const rowDataStr = currentData.data[i].join(', ');
                consoleOutput.textContent = `-> Yielding Index [${idx}]\n   Data: [${rowDataStr}]`;

                const rowCells = document.querySelectorAll(`[id^="idx-${idx}"], [id^="cell-${idx}-"]`);
                rowCells.forEach(cell => {
                    cell.style.animation = 'iterateRow 1s forwards';
                });
            }, i * 1200);
        });
        
        // Reset opacity after all animations
        setTimeout(() => {
            allCells.forEach(c => c.style.opacity = '1');
            consoleOutput.textContent = "=> Iteration complete.";
        }, currentData.index.length * 1200 + 1000);
    },

    animateIterCols: () => {
        showConsole("for col_name, col_data in df.items():", "=> Starting Column Iteration...");
        renderTable();
        // Dim all cells
        const allCells = document.querySelectorAll('.df-cell');
        allCells.forEach(c => c.style.opacity = '0.4');

        currentData.columns.forEach((colName, i) => {
            setTimeout(() => {
                // Determine column data values
                const colVals = currentData.data.map(r => r[i]).join(', ');
                consoleOutput.textContent = `-> Yielding Column [${colName}]\n   Data: [${colVals}]`;

                const colHeaderCell = document.getElementById(`col-${i}`);
                if (colHeaderCell) colHeaderCell.style.animation = 'iterateRow 1s forwards';
                
                // Select all data cells in this column (cell-rowIndex-colIndex)
                const dataCells = document.querySelectorAll(`[id^="cell-"][id$="-${i}"]`);
                dataCells.forEach(cell => {
                    cell.style.animation = 'iterateRow 1s forwards';
                });
            }, i * 1200);
        });
        
        // Reset opacity after all animations
        setTimeout(() => {
            allCells.forEach(c => c.style.opacity = '1');
            consoleOutput.textContent = "=> Iteration complete.";
        }, currentData.columns.length * 1200 + 1000);
    },

    // --- Selection & Access ---
    selectColumn: () => {
        showConsole("df['Name']", "=> 0      Alice\n1        Bob\n2    Charlie\n3      David\nName: Name, dtype: object");
        renderTable(); // ensure full table rendering
        
        setTimeout(() => {
            const nameIdx = currentData.columns.indexOf('Name');
            if(nameIdx === -1) return;
            
            const allCells = document.querySelectorAll('.df-cell');
            allCells.forEach(c => c.style.opacity = '0.3'); // dim everything
            
            // Highlight the column header and its data
            const colHeader = document.getElementById(`col-${nameIdx}`);
            if(colHeader) {
                colHeader.style.opacity = '1';
                colHeader.classList.add('anim-highlight');
            }
            
            const dataCells = document.querySelectorAll(`[id^="cell-"][id$="-${nameIdx}"]`);
            dataCells.forEach(cell => {
                cell.style.opacity = '1';
                cell.classList.add('anim-highlight');
            });
        }, 50);
    },

    selectMultiColumns: () => {
        showConsole("df[['Name', 'Score']]", "=>       Name  Score\n0    Alice     85\n1      Bob     90\n2  Charlie     95\n3    David     80");
        renderTable(); // reset
        
        setTimeout(() => {
            const allCells = document.querySelectorAll('.df-cell');
            allCells.forEach(c => c.style.opacity = '0.3');
            
            ['Name', 'Score'].forEach(col => {
                const idx = currentData.columns.indexOf(col);
                if(idx === -1) return;
                
                const colHeader = document.getElementById(`col-${idx}`);
                if(colHeader) {
                    colHeader.style.opacity = '1';
                    colHeader.classList.add('anim-highlight');
                }
                
                const dataCells = document.querySelectorAll(`[id^="cell-"][id$="-${idx}"]`);
                dataCells.forEach(cell => {
                    cell.style.opacity = '1';
                    cell.classList.add('anim-highlight');
                });
            });
        }, 50);
    },

    showLoc: () => {
        // Label based indexing
        showConsole("df.loc[0]", "=> Name     Alice\nAge         25\nScore       85\nName: 0, dtype: object");
        renderTable();
        
        setTimeout(() => {
            const allCells = document.querySelectorAll('.df-cell');
            allCells.forEach(c => c.style.opacity = '0.3');
            
            // Assuming index 0 exists
            const idxIndex = currentData.index.indexOf(0);
            if(idxIndex > -1) {
                const rowCells = document.querySelectorAll(`[id^="idx-${currentData.index[idxIndex]}"], [id^="cell-${currentData.index[idxIndex]}-"]`);
                rowCells.forEach(cell => {
                    cell.style.opacity = '1';
                    cell.classList.add('anim-highlight');
                });
            }
        }, 50);
    },

    showIloc: () => {
        // Integer-location based indexing
        showConsole("df.iloc[0:2]", "=>       Name  Age  Score\n0    Alice   25     85\n1      Bob   30     90");
        renderTable();
        
        setTimeout(() => {
            const allCells = document.querySelectorAll('.df-cell');
            allCells.forEach(c => c.style.opacity = '0.3');
            
            // Highlight first two rows if they exist
            for(let i=0; i<Math.min(2, currentData.index.length); i++) {
                const idxVal = currentData.index[i];
                const rowCells = document.querySelectorAll(`[id^="idx-${idxVal}"], [id^="cell-${idxVal}-"]`);
                rowCells.forEach(cell => {
                    cell.style.opacity = '1';
                    cell.classList.add('anim-highlight');
                });
            }
        }, 50);
    },

    // --- Filtering & Conditions ---
    keepScoreNot90: () => {
        const richHTML = `
        <div class="syntax-view" style="background: transparent; padding: 0.5rem 0; margin-bottom: 0;">
            <div class="syn-expression" style="margin-bottom: 0; font-size: 1.1rem;">
                <span class="syn-plain" style="color:#e2e8f0;">df = </span><span class="syn-bold" style="color:#e2e8f0;">df</span><span class="syn-punct purple">[</span>
                <div class="syn-group color-blue">
                    <div class="syn-text"><span class="syn-plain" style="color:#e2e8f0;">df</span><span class="syn-punct green">[</span><span class="syn-plain" style="color:#e2e8f0;">'Score'</span><span class="syn-punct green">]</span> <span class="syn-plain" style="color:#e2e8f0;">!<span>=</span> 90</span></div>
                    <div class="syn-brace"></div>
                    <div class="syn-desc">
                        <div class="desc-line"><span class="icon-check">✅</span> <span style="color:#94a3b8;">Keeps rows except those where Score = 90</span></div>
                    </div>
                </div>
                <span class="syn-punct purple">]</span>
            </div>
        </div>`;
        showConsole("df = df[df['Score'] != 90]", "=> Filtering table to KEEP rows where Score is NOT 90.", richHTML);
        
        const scoreIdx = currentData.columns.indexOf('Score');
        if(scoreIdx === -1) return;
        
        const filteredData = {
            columns: currentData.columns,
            index: [],
            data: []
        };
        
        const droppedIndices = [];
        for(let i=0; i<currentData.data.length; i++) {
            if(currentData.data[i][scoreIdx] != 90) {
                filteredData.data.push(currentData.data[i]);
                filteredData.index.push(currentData.index[i]);
            } else {
                droppedIndices.push(i);
                const rowCells = document.querySelectorAll(`[id^="idx-${currentData.index[i]}"], [id^="cell-${currentData.index[i]}-"]`);
                rowCells.forEach(cell => {
                    cell.classList.add('ghosted-element');
                });
            }
        }
        
        setTimeout(() => {
            for(let i of droppedIndices) {
                const rowCells = document.querySelectorAll(`[id^="idx-${currentData.index[i]}"], [id^="cell-${currentData.index[i]}-"]`);
                rowCells.forEach(cell => {
                    cell.style.animation = 'dropRow 0.6s forwards cubic-bezier(0.55, 0.085, 0.68, 0.53)';
                });
            }
            setTimeout(() => renderTable(filteredData, false), 600);
        }, 1200);
    },

    dropScoreEq90: () => {
        const richHTML = `
        <div class="syntax-view" style="background: transparent; padding: 0.5rem 0; margin-bottom: 0;">
            <div class="syn-expression" style="margin-bottom: 0; font-size: 1.1rem;">
                <span class="syn-plain" style="color:#e2e8f0;">df.drop(</span><span class="syn-bold" style="color:#e2e8f0;">df</span><span class="syn-punct red">[</span>
                <div class="syn-group color-orange">
                    <div class="syn-text"><span class="syn-plain" style="color:#e2e8f0;">df</span><span class="syn-punct purple">[</span><span class="syn-plain" style="color:#e2e8f0;">'Score'</span><span class="syn-punct purple">]</span> <span class="syn-plain" style="color:#e2e8f0;">== 90</span></div>
                    <div class="syn-brace"></div>
                    <div class="syn-desc">
                        <div class="desc-line"><span class="icon-cross">❌</span> <span style="color:#94a3b8;">Removes rows with Score = 90</span></div>
                    </div>
                </div>
                <span class="syn-punct red">]</span><span class="syn-bold" style="color:#e2e8f0;">.index</span><span class="syn-plain" style="color:#e2e8f0;">)</span>
            </div>
        </div>`;
        showConsole("df.drop(df[df['Score'] == 90].index)", "=> Visual table updated (Dropped rows where Score == 90)", richHTML);
        
        const scoreIdx = currentData.columns.indexOf('Score');
        if(scoreIdx === -1) return;
        
        const droppedIndices = [];
        for(let i=0; i<currentData.data.length; i++) {
            if(currentData.data[i][scoreIdx] == 90) {
                droppedIndices.push(i);
                
                const rowCells = document.querySelectorAll(`[id^="idx-${currentData.index[i]}"], [id^="cell-${currentData.index[i]}-"]`);
                rowCells.forEach(cell => {
                    cell.classList.add('ghosted-element');
                });
            }
        }
        
        setTimeout(() => {
            droppedIndices.forEach((dropIdx) => {
                const rowCells = document.querySelectorAll(`[id^="idx-${currentData.index[dropIdx]}"], [id^="cell-${currentData.index[dropIdx]}-"]`);
                rowCells.forEach(cell => {
                    cell.style.animation = 'dropRow 0.6s forwards cubic-bezier(0.55, 0.085, 0.68, 0.53)';
                });
            });

            setTimeout(() => {
                const newData = [];
                const newIndex = [];
                for(let i=0; i<currentData.data.length; i++) {
                    if(!droppedIndices.includes(i)) {
                        newData.push(currentData.data[i]);
                        newIndex.push(currentData.index[i]);
                    }
                }
                currentData.data = newData;
                currentData.index = newIndex;
                
                renderTable(currentData, false);
            }, 600);
        }, 1200);
    },

    dropColIfAny: () => {
        showConsole("if (df['Score'] < 90).any():\n    df = df.drop(columns=['Score'])", "=> Checking if any Score < 90... True. Dropping Score column.");
        
        const scoreIdx = currentData.columns.indexOf('Score');
        if(scoreIdx === -1) return;

        let anyUnder90 = false;
        for(let i=0; i<currentData.data.length; i++) {
            if(currentData.data[i][scoreIdx] < 90) {
                 anyUnder90 = true;
                 break;
            }
        }

        if (anyUnder90) {
             const colCells = document.querySelectorAll(`[id^="col-${scoreIdx}"], [id^="cell-"][id$="-${scoreIdx}"]`);
             colCells.forEach(cell => {
                 cell.classList.add('ghosted-element');
             });

             setTimeout(() => {
                 colCells.forEach(cell => {
                     cell.style.animation = 'dropRow 0.6s forwards cubic-bezier(0.55, 0.085, 0.68, 0.53)';
                 });

                 setTimeout(() => {
                     currentData.columns.splice(scoreIdx, 1);
                     for(let i=0; i<currentData.data.length; i++) {
                         currentData.data[i].splice(scoreIdx, 1);
                     }
                     renderTable(currentData, false);
                 }, 600);
             }, 1200);
        }
    },

    multiConditionFilter: () => {
        const richHTML = `
        <div class="syntax-view" style="background: transparent; padding: 0.5rem 0; margin-bottom: 0;">
            <div class="syn-expression" style="margin-bottom: 0; font-size: 1.1rem;">
                <span class="syn-plain" style="color:#e2e8f0;">df = </span><span class="syn-bold" style="color:#e2e8f0;">df</span><span class="syn-punct purple">[</span>
                <span class="syn-punct green">(</span><span class="syn-plain" style="color:#e2e8f0;">df['Score'] >= 90</span><span class="syn-punct green">)</span>
                <span class="syn-bold" style="color:#e2e8f0;"> &amp; </span>
                <span class="syn-punct green">(</span><span class="syn-plain" style="color:#e2e8f0;">df['Age'] > 25</span><span class="syn-punct green">)</span>
                <span class="syn-punct purple">]</span>
            </div>
        </div>`;
        showConsole("df_filtered = df[(df['Score'] >= 90) & (df['Age'] > 25)]", "=> Keeping rows meeting multiple conditions AND.", richHTML);
        
        const scoreIdx = currentData.columns.indexOf('Score');
        const ageIdx = currentData.columns.indexOf('Age');
        if (scoreIdx === -1 || ageIdx === -1) return;

        const filteredData = { columns: currentData.columns, index: [], data: [] };
        const droppedIndices = [];
        for (let i = 0; i < currentData.data.length; i++) {
            if (currentData.data[i][scoreIdx] >= 90 && currentData.data[i][ageIdx] > 25) {
                filteredData.data.push(currentData.data[i]);
                filteredData.index.push(currentData.index[i]);
            } else {
                droppedIndices.push(i);
                const rowCells = document.querySelectorAll(`[id^="idx-${currentData.index[i]}"], [id^="cell-${currentData.index[i]}-"]`);
                rowCells.forEach(cell => cell.classList.add('ghosted-element'));
            }
        }
        
        setTimeout(() => {
            droppedIndices.forEach((dropIdx) => {
                const rowCells = document.querySelectorAll(`[id^="idx-${currentData.index[dropIdx]}"], [id^="cell-${currentData.index[dropIdx]}-"]`);
                rowCells.forEach(cell => {
                    cell.style.animation = 'dropRow 0.6s forwards cubic-bezier(0.55, 0.085, 0.68, 0.53)';
                });
            });
            setTimeout(() => renderTable(filteredData, false), 600);
        }, 1200);
    },

    complexColDrop: () => {
        showConsole("df = df.drop(columns=[c for c in ['Score'] if (df[c] < 90).any() | (df[c].mean() < 95)])", "=> Dropping Score based on ANY < 90 OR MEAN < 95.");
        const scoreIdx = currentData.columns.indexOf('Score');
        if(scoreIdx === -1) return;

        let anyUnder90 = false;
        let sum = 0;
        let count = 0;
        for(let i=0; i<currentData.data.length; i++) {
            const val = currentData.data[i][scoreIdx];
            if(val < 90) anyUnder90 = true;
            sum += val;
            count++;
        }
        const mean = count > 0 ? (sum / count) : 0;
        
        if (anyUnder90 || mean < 95) {
            const colCells = document.querySelectorAll(`[id^="col-${scoreIdx}"], [id^="cell-"][id$="-${scoreIdx}"]`);
            colCells.forEach(cell => cell.classList.add('ghosted-element'));

            setTimeout(() => {
                colCells.forEach(cell => {
                    cell.style.animation = 'dropRow 0.6s forwards cubic-bezier(0.55, 0.085, 0.68, 0.53)';
                });
                setTimeout(() => {
                    currentData.columns.splice(scoreIdx, 1);
                    for(let i=0; i<currentData.data.length; i++) {
                        currentData.data[i].splice(scoreIdx, 1);
                    }
                    renderTable(currentData, false);
                }, 600);
            }, 1200);
        }
    },

    // --- Enhanced Modifications ---
    fillNaData: () => {
        showConsole("df = df.fillna(0)", "=> Replacing all NaN values with 0");
        let hasNan = false;
        
        for(let r=0; r<currentData.data.length; r++) {
            for(let c=0; c<currentData.columns.length; c++) {
                if(currentData.data[r][c] === 'NaN' || Number.isNaN(currentData.data[r][c])) {
                    currentData.data[r][c] = 0;
                    hasNan = true;
                }
            }
        }

        renderTable(currentData, false);
        if(hasNan) {
            // Pulse table to show update
            const df = document.querySelector('.dataframe');
            if(df) {
                df.style.boxShadow = '0 0 15px rgba(255,165,0,0.5)';
                setTimeout(() => df.style.boxShadow = '', 1000);
            }
        } else {
            consoleOutput.textContent += "\n(No NaN values found in the data)";
        }
    },

    dropNaData: () => {
        showConsole("df = df.dropna()", "=> Dropping all rows containing NaN values");
        let hasNanRows = false;
        const rowsToKeep = [];
        const indexToKeep = [];

        for(let r=0; r<currentData.data.length; r++) {
            let rowHasNan = false;
            for(let c=0; c<currentData.columns.length; c++) {
                if(currentData.data[r][c] === 'NaN' || Number.isNaN(currentData.data[r][c])) {
                    rowHasNan = true;
                    break;
                }
            }
            if(!rowHasNan) {
                rowsToKeep.push(currentData.data[r]);
                indexToKeep.push(currentData.index[r]);
            } else {
                hasNanRows = true;
            }
        }

        currentData.data = rowsToKeep;
        currentData.index = indexToKeep;
        
        tableContainer.innerHTML = '<div class="placeholder-text">Dropping NaNs...</div>';
        setTimeout(() => {
            renderTable(currentData, false);
            if(!hasNanRows) {
               consoleOutput.textContent += "\n(No NaN values found, no rows dropped)";
            }
        }, 400);
    },

    addColumn: () => {
        showConsole("df['Grade'] = ['B', 'A', 'A', 'C']", "=> New column 'Grade' added.");
        
        if (currentData.columns.includes('Grade')) return; // Prevent arbitrary re-adding if present
        
        currentData.columns.push('Grade');
        const grades = ['B', 'A', 'A', 'C'];
        
        // Match lengths just in case data was altered
        for(let i=0; i<currentData.data.length; i++) {
            currentData.data[i].push(grades[i] || 'N/A');
        }
        
        renderTable(currentData, false);
        
        // Highlight the new column
        setTimeout(() => {
            const newColIdx = currentData.columns.length - 1;
            const colHeader = document.getElementById(`col-${newColIdx}`);
            if(colHeader) colHeader.classList.add('anim-highlight');
            
            const dataCells = document.querySelectorAll(`[id^="cell-"][id$="-${newColIdx}"]`);
            dataCells.forEach(cell => {
                cell.classList.add('anim-highlight');
            });
        }, 50);
    },

    npWhereAssign: () => {
        showConsole("df['Result'] = np.where((df['Score'] > 90) & (df['Age'] > 25), 'Pass', 'Fail')", "=> Creating Result col based on multiple conditions.");
        
        if (currentData.columns.includes('Result')) return;
        
        currentData.columns.push('Result');
        const scoreIdx = currentData.columns.indexOf('Score');
        const ageIdx = currentData.columns.indexOf('Age');
        
        for(let i=0; i<currentData.data.length; i++) {
            let pass = false;
            // Find current data in row
            if (scoreIdx > -1 && ageIdx > -1) {
                if (currentData.data[i][scoreIdx] > 90 && currentData.data[i][ageIdx] > 25) {
                    pass = true;
                }
            }
            currentData.data[i].push(pass ? 'Pass' : 'Fail');
        }
        
        renderTable(currentData, false);
        
        setTimeout(() => {
            const newColIdx = currentData.columns.length - 1;
            const colHeader = document.getElementById(`col-${newColIdx}`);
            if(colHeader) colHeader.classList.add('anim-highlight');
            
            const dataCells = document.querySelectorAll(`[id^="cell-"][id$="-${newColIdx}"]`);
            dataCells.forEach(cell => {
                cell.classList.add('anim-highlight');
            });
        }, 50);
    },

    reindexData: () => {
        showConsole("df.reindex([2, 0, 3])", "=> Rows reordered. Missing indices produce NaN rows.");
        
        const newOrder = [2, 0, 3];
        const newData = [];
        
        newOrder.forEach(idx => {
            // Find if idx exists in currentData
            const i = currentData.index.indexOf(idx);
            if(i > -1) {
                newData.push(currentData.data[i]);
            } else {
                // If it doesn't exist, fill with NaN
                newData.push(Array(currentData.columns.length).fill('NaN'));
            }
        });
        
        currentData.index = newOrder;
        currentData.data = newData;
        
        tableContainer.innerHTML = '<div class="placeholder-text">Reindexing Data...</div>';
        setTimeout(() => renderTable(currentData, false), 400);
    },

    // --- CSV Specific Methods ---
    animateCSVWrite: () => {
        showConsole("df.to_csv('backup.csv', index=False)", "=> Exporting DataFrame to CSV format...");
        const csvContainer = document.createElement('div');
        csvContainer.className = 'placeholder-text';
        csvContainer.style.fontFamily = 'monospace';
        csvContainer.style.whiteSpace = 'pre';
        csvContainer.style.textAlign = 'left';
        csvContainer.style.color = '#10b981';
        
        let headerRow = currentData.columns.join(',');
        let dataRows = currentData.data.map(row => row.join(',')).join('\\n');
        csvContainer.innerHTML = 'Writing to backup.csv...<br><br>' + headerRow + '<br>' + dataRows;
        
        tableContainer.innerHTML = '';
        tableContainer.appendChild(csvContainer);
    },

    csvReadNrows: () => {
        showConsole("pd.read_csv('data.csv', nrows=2)", "=> Reading only the first 2 rows from the CSV file.");
        const newData = JSON.parse(JSON.stringify(defaultData));
        newData.data = newData.data.slice(0, 2);
        newData.index = newData.index.slice(0, 2);
        currentData = newData;
        renderTable();
    },

    csvReadSkiprows: () => {
        showConsole("pd.read_csv('data.csv', skiprows=1)", "=> Skipping the first row (e.g., Alice's data) when reading.");
        const newData = JSON.parse(JSON.stringify(defaultData));
        newData.data = newData.data.slice(1);
        newData.index = [0, 1, 2]; // new 0-indexed default index
        currentData = newData;
        renderTable();
    },

    csvReadUsecols: () => {
        showConsole("pd.read_csv('data.csv', usecols=['Name', 'Score'])", "=> Loading only specific columns into DataFrame.");
        const newData = {
            columns: ['Name', 'Score'],
            index: defaultData.index,
            data: defaultData.data.map(row => [row[0], row[2]])
        };
        currentData = newData;
        renderTable();
    },

    csvReadNames: () => {
        showConsole("pd.read_csv('data.csv', header=0, names=['Student_Name', 'Student_Age', 'Student_Score'])", "=> Overwriting default header names with custom ones.");
        const newData = JSON.parse(JSON.stringify(defaultData));
        newData.columns = ['Student_Name', 'Student_Age', 'Student_Score'];
        currentData = newData;
        renderTable();
    },

    csvReadIndexCol: () => {
        showConsole("pd.read_csv('data.csv', index_col='Name')", "=> Using the 'Name' column as the row index labels.");
        const newData = {
            columns: ['Age', 'Score'],
            index: defaultData.data.map(row => row[0]), // Use 'Name' as index
            data: defaultData.data.map(row => [row[1], row[2]]) // Age, Score
        };
        currentData = newData;
        renderTable();
    }
};

// Event Listeners
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        navItems.forEach(nav => nav.classList.remove('active'));
        e.currentTarget.classList.add('active');
        setTopic(e.currentTarget.dataset.topic);
    });
});

themeToggle.addEventListener('click', () => {
    isDarkTheme = !isDarkTheme;
    document.body.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
});

const axisToggle = document.getElementById('axis-toggle-chk');
if(axisToggle) {
    axisToggle.addEventListener('change', (e) => {
        const ax0 = document.getElementById('axis-0-overlay');
        const ax1 = document.getElementById('axis-1-overlay');
        if(e.target.checked) {
            if(ax0) ax0.style.display = 'flex';
            if(ax1) ax1.style.display = 'flex';
        } else {
            if(ax0) ax0.style.display = 'none';
            if(ax1) ax1.style.display = 'none';
        }
    });
}

// Initialize
setTopic('basics');

// --- Quiz Logic ---
let currentQuizQuestions = [];
let quizQuestionOrder = [];
let currentQuizIndex = 0;

function startQuiz() {
    const quizQuestionsContainer = document.getElementById('quiz-questions');
    const resultDiv = document.getElementById('quiz-score');
    const submitBtn = document.getElementById('submit-quiz-btn');
    const restartBtn = document.getElementById('restart-quiz-btn');
    
    if(!quizQuestionsContainer) return;
    
    // Reset states
    resultDiv.style.display = 'none';
    resultDiv.textContent = '';
    submitBtn.style.display = 'inline-block';
    restartBtn.style.display = 'none';
    quizQuestionsContainer.innerHTML = '';
    
    // Check if questions are loaded globally (via app.py injection)
    let bank = window.questionBank;
    if (!bank || bank.length === 0) {
        quizQuestionsContainer.innerHTML = '<p class="placeholder-text">Loading questions...</p>';
        fetch('questions.json')
            .then(res => res.json())
            .then(data => {
                window.questionBank = data;
                startQuiz(); // re-run
            })
            .catch(err => {
                quizQuestionsContainer.innerHTML = '<p class="placeholder-text">Error: Question bank not loaded locally.</p>';
                console.error(err);
            });
        return;
    }
    
    // Shuffle completely once, then pick 5 progressively without overlap
    if (quizQuestionOrder.length === 0 || currentQuizIndex + 5 > bank.length) {
        let shuffledBank = [...bank];
        for (let i = shuffledBank.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledBank[i], shuffledBank[j]] = [shuffledBank[j], shuffledBank[i]];
        }
        quizQuestionOrder = shuffledBank;
        currentQuizIndex = 0;
    }
    
    currentQuizQuestions = quizQuestionOrder.slice(currentQuizIndex, currentQuizIndex + 5);
    currentQuizIndex += 5;
    
    // Render
    currentQuizQuestions.forEach((q, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'quiz-question-card';
        cardDiv.id = `question-card-${index}`;
        
        let html = `<div class="quiz-question-text">${index + 1}. ${escapeHTML(q.question)}</div>`;
        html += `<div class="quiz-options">`;
        
        q.options.forEach((opt, optIndex) => {
            html += `
                <label class="quiz-option-label" id="label-${index}-${optIndex}">
                    <input type="radio" name="q${index}" value="${escapeHTML(opt)}">
                    ${escapeHTML(opt)}
                </label>
            `;
        });
        html += `</div>`;
        cardDiv.innerHTML = html;
        quizQuestionsContainer.appendChild(cardDiv);
    });
}

function submitQuiz() {
    let score = 0;
    let answered = 0;
    
    currentQuizQuestions.forEach((q, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        if(selected) answered++;
    });
    
    if(answered < currentQuizQuestions.length) {
        alert("Please answer all 5 questions before submitting!");
        return;
    }
    
    // Evaluate
    currentQuizQuestions.forEach((q, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        const cardDiv = document.getElementById(`question-card-${index}`);
        const correctAnswer = q.answer;
        
        // Find correct option index visually
        q.options.forEach((opt, optIndex) => {
            const label = document.getElementById(`label-${index}-${optIndex}`);
            const isSelected = selected && selected.value === opt;
            const isCorrect = opt === correctAnswer;
            
            if(isCorrect) {
                label.classList.add('correct');
            } else if (isSelected && !isCorrect) {
                label.classList.add('incorrect');
            }
            
            // Disable inputs
            const input = label.querySelector('input');
            if(input) input.disabled = true;
        });
        
        if(selected && selected.value === correctAnswer) {
            score++;
        }
    });
    
    // Display result
    const resultDiv = document.getElementById('quiz-score');
    resultDiv.style.display = 'block';
    
    if(score === 5) {
        resultDiv.style.color = 'var(--accent-tertiary)';
        resultDiv.textContent = `🎉 Flawless! You scored ${score} / 5!`;
    } else if (score >= 3) {
        resultDiv.style.color = 'var(--accent-primary)';
        resultDiv.textContent = `👍 Good job! You scored ${score} / 5.`;
    } else {
        resultDiv.style.color = 'var(--accent-danger)';
        resultDiv.textContent = `📚 Keep practicing! You scored ${score} / 5.`;
    }
    
    document.getElementById('submit-quiz-btn').style.display = 'none';
    document.getElementById('restart-quiz-btn').style.display = 'inline-block';
    
    // Scroll to top of quiz to see score
    document.getElementById('quiz-container').scrollTo({ top: 0, behavior: 'smooth' });
}

function escapeHTML(str) {
    if(!str) return '';
    return str.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}