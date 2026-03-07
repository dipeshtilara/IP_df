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
        code: `import pandas as pd\n\ndata = {\n  "Name": ["Alice", "Bob", "Charlie", "David"],\n  "Age": [25, 30, 35, 40],\n  "Score": [85, 90, 95, 80]\n}\ndf = pd.DataFrame(data)`,
        buttons: [
            { label: "Create DataFrame", action: "renderTable", class: "primary" },
            { label: "df.head(2)", action: "showHead", class: "" },
            { label: "df.tail(1)", action: "showTail", class: "" }
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
        code: `# Manipulating Data\ndf = df.sort_values(by='Score', ascending=False)\ndf = df.rename(columns={'Name': 'Student'}) # Rename column\ndf.reindex([2, 0, 3]) # Reindex rows\ndf = df.drop(index=1) # Drop Bob\ndf = df.T # Transpose DataFrame\ndf['Grade'] = ['B', 'A', 'A', 'C'] # Add new column\n# Missing Data\ndf = df.fillna(0) # Replace NaNs with 0\ndf = df.dropna() # Drop rows with NaNs`,
        buttons: [
            { label: "df['Grade'] = ... (Add Col)", action: "addColumn", class: "success" },
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

# 2. Remove rows where Score == 90
df.drop(df[df['Score'] == 90].index)

# 3. Drop column if ANY value in 'Score' < 90
if (df['Score'] < 90).any(): 
    df = df.drop(columns=['Score'])`,
        buttons: [
            { label: "Keep if Score != 90", action: "keepScoreNot90", class: "primary" },
            { label: "Drop if Score == 90", action: "dropScoreEq90", class: "danger" },
            { label: "Drop Col if Any Score < 90", action: "dropColIfAny", class: "warning" },
            { label: "Reset DataFrame", action: "resetData", class: "" }
        ]
    },
    transfer: {
        title: "CSV Data Transfer",
        desc: "Easily load data from CSV files and export DataFrame to CSV format.",
        code: `# Reading and Writing CSV files\n\n# Read from CSV\ndf = pd.read_csv('students.csv')\n\n# Write to CSV\ndf.to_csv('backup.csv', index=False)`,
        buttons: [
            { label: "pd.read_csv()", action: "animateCSVRead", class: "primary" },
            { label: "df.to_csv()", action: "animateCSVWrite", class: "success" }
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
    const info = topicsInfo[topic];
    topicTitle.textContent = info.title;
    topicDoc.textContent = info.desc;
    
        // Format code block
    codeSnippet.innerHTML = `<code>${info.code.replace(/\\n/g, '<br>').replace(/ /g, '&nbsp;')}</code>`;
    
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

function showConsole(syntax, output) {
    if(!actionConsole) return;
    actionConsole.classList.remove('visible');
    
    // trigger reflow to reset animation
    void actionConsole.offsetWidth;
    
    consoleSyntax.textContent = syntax || '';
    consoleOutput.textContent = output || '';
    
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
    },

    showNdim: () => {
        showConsole("df.ndim", "=> 2    # DataFrame is a 2D data structure");
    },
    
    showEmpty: () => {
        const isEmpty = currentData.data.length === 0;
        showConsole("df.empty", `=> ${isEmpty ? 'True' : 'False'}`);
    },

    showDtypes: () => {
        showConsole("df.dtypes", "Name      object\nAge        int64\nScore      int64\ndtype: object");
    },

    showHasNan: () => {
        showConsole("df.isna().any()", "Name     False\nAge      False\nScore    False\ndtype: bool");
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
            // Animate out
            const rowCells = document.querySelectorAll(`[id^="idx-1"], [id^="cell-1-"]`);
            rowCells.forEach(cell => {
                cell.style.animation = 'dropRow 0.6s forwards cubic-bezier(0.55, 0.085, 0.68, 0.53)';
            });
            
            // Remove from data source after animation
            setTimeout(() => {
                currentData.data.splice(idxIndex, 1);
                currentData.index.splice(idxIndex, 1);
                renderTable(currentData, false);
            }, 600);
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
        showConsole("df = df[df['Score'] != 90]", "=> Filtering table to KEEP rows where Score is NOT 90.");
        
        const scoreIdx = currentData.columns.indexOf('Score');
        if(scoreIdx === -1) return;
        
        const filteredData = {
            columns: currentData.columns,
            index: [],
            data: []
        };
        
        for(let i=0; i<currentData.data.length; i++) {
            if(currentData.data[i][scoreIdx] != 90) {
                filteredData.data.push(currentData.data[i]);
                filteredData.index.push(currentData.index[i]);
            }
        }
        
        tableContainer.innerHTML = '<div class="placeholder-text">Filtering Data...</div>';
        setTimeout(() => renderTable(filteredData), 400);
    },

    dropScoreEq90: () => {
        showConsole("df.drop(df[df['Score'] == 90].index)", "=> Visual table updated (Dropped rows where Score == 90)");
        
        const scoreIdx = currentData.columns.indexOf('Score');
        if(scoreIdx === -1) return;
        
        const droppedIndices = [];
        for(let i=0; i<currentData.data.length; i++) {
            if(currentData.data[i][scoreIdx] == 90) {
                droppedIndices.push(i);
                
                const rowCells = document.querySelectorAll(`[id^="idx-${currentData.index[i]}"], [id^="cell-${currentData.index[i]}-"]`);
                rowCells.forEach(cell => {
                    cell.style.animation = 'dropRow 0.6s forwards cubic-bezier(0.55, 0.085, 0.68, 0.53)';
                });
            }
        }
        
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
                 cell.style.animation = 'dropRow 0.6s forwards cubic-bezier(0.55, 0.085, 0.68, 0.53)';
             });

             setTimeout(() => {
                 currentData.columns.splice(scoreIdx, 1);
                 for(let i=0; i<currentData.data.length; i++) {
                     currentData.data[i].splice(scoreIdx, 1);
                 }
                 renderTable(currentData, false);
             }, 600);
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

// Initialize
setTopic('basics');
