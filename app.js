/**
 * Premium Portfolio JS Engine
 * Handles Interactive Terminals, Scroll Spy, Mobile Navigation, and Contact Simulation
 * Author: Likhita Bandaru
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------
    // 1. Mobile Navigation & Scroll Spy
    // -------------------------------------------------
    const mobileToggle = document.getElementById('mobileNavToggle');
    const navMenu = document.getElementById('mainNavigation');
    const header = document.querySelector('.main-header');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            // Inline menu toggle styling
            if (navMenu.classList.contains('active')) {
                navMenu.style.display = 'flex';
                navMenu.style.flexDirection = 'column';
                navMenu.style.position = 'absolute';
                navMenu.style.top = '100%';
                navMenu.style.left = '0';
                navMenu.style.width = '100%';
                navMenu.style.backgroundColor = '#0b0c13';
                navMenu.style.padding = '20px';
                navMenu.style.borderBottom = '1px solid var(--border-color)';
            } else {
                navMenu.style.display = '';
            }
        });
    }

    // Scroll spy navigation highlight
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 180)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });

        // Add blur class on scroll
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
        } else {
            header.style.boxShadow = 'none';
        }
    });

    // -------------------------------------------------
    // 2. Interactive Terminal Simulator
    // -------------------------------------------------
    const projectTabs = document.querySelectorAll('.project-tab');
    const consoleBody = document.getElementById('terminalConsoleBody');
    const consoleInput = document.getElementById('terminalConsoleInput');
    const promptSign = document.getElementById('terminalPromptSign');
    const windowTitle = document.getElementById('terminalWindowTitle');
    const metaTitle = document.getElementById('projectInfoTitle');
    const metaDesc = document.getElementById('projectInfoDesc');

    // Projects Metadata
    const projectsMeta = {
        navigation: {
            title: "Campus Navigation System",
            desc: "Engineered a graph-based campus navigation application in Java modeling 20+ real-world Rowan locations and weighted paths. Implemented Dijkstra's shortest path algorithm (O(E log V)) with dynamic blockage handling.",
            file: "Terminal - CampusNavigationApp.java",
            prompt: "java@rowan-jvm:~$ ",
            placeholder: "Select menu option (1-6) or type..."
        },
        toolkit: {
            title: "Linux System Utility Toolkit",
            desc: "Developed a suite of 5+ Bash automation scripts for Linux system administration tasks including disk usage monitoring, system diagnostics, and process management, reducing manual checks by 40%.",
            file: "Terminal - toolkit.sh",
            prompt: "bash@linux-server:~$ ",
            placeholder: "Select tool (1-6) or run commands..."
        },
        library: {
            title: "Library Management System",
            desc: "Designed and built a Java application managing 100+ book and student records, structuring the system using OOP principles (inheritance, encapsulation, abstraction) for a scalable, maintainable codebase.",
            file: "Terminal - LibraryApp.java",
            prompt: "java@library-db:~$ ",
            placeholder: "Select option (1-8) or search..."
        },
        calculator: {
            title: "Student Grade Calculator",
            desc: "Built a Python program to compute student averages and final percentages across subjects using loops, conditionals, and modular functions, producing clean, reusable, and well-structured code.",
            file: "Terminal - grade_calculator.py",
            prompt: "python@interpreter:~$ ",
            placeholder: "Type option (1-3) or run..."
        }
    };

    // Simulated States
    let currentProject = 'navigation';
    let termState = 'MENU'; // For managing sub-prompts
    let inputBuffer = [];
    
    // In-memory navigation database for simulator
    const campusMap = {
        nodes: [
            "Chamberlain Student Center", "Campbell Library", "Savitz Hall", 
            "Robinson Hall", "Science Hall", "Rowan Hall", "Engineering Hall", 
            "Business Hall", "Bozorth Hall", "Bunce Hall", "Wilson Hall", 
            "Esby Gym", "Rec Center", "Barnes & Noble", "Hollybush Mansion"
        ],
        blockages: { nodes: [], edges: [] }
    };

    // In-memory library catalog for simulator
    const libraryDb = {
        books: [
            { isbn: "9780134685991", title: "Effective Java", author: "Joshua Bloch", qty: "4/5" },
            { isbn: "9780132350884", title: "Clean Code", author: "Robert Martin", qty: "2/3" },
            { isbn: "9780135957059", title: "The Pragmatic Programmer", author: "David Thomas", qty: "4/4" },
            { isbn: "9780201633610", title: "Design Patterns", author: "Erich Gamma", qty: "1/2" }
        ],
        students: [
            { id: "S101", name: "Likhita Bandaru", borrowed: ["Effective Java"] },
            { id: "S102", name: "Alex Rivera", borrowed: ["Clean Code"] }
        ]
    };

    // Grade Calculator variables
    let tempGradeData = {
        course: "",
        categories: []
    };

    // Print a line in the terminal console
    function printTerm(text, type = 'output') {
        const line = document.createElement('div');
        line.className = `term-line term-${type}`;
        line.innerText = text;
        consoleBody.appendChild(line);
        consoleBody.scrollTop = consoleBody.scrollHeight;
    }

    // Initialize/Reset Terminal
    function initTerminal(projectKey) {
        currentProject = projectKey;
        termState = 'MENU';
        inputBuffer = [];
        consoleBody.innerHTML = '';
        
        const meta = projectsMeta[projectKey];
        windowTitle.innerText = meta.file;
        promptSign.innerText = meta.prompt;
        consoleInput.placeholder = meta.placeholder;
        consoleInput.value = '';

        printTerm(`Loading project environments...`, 'warning');
        setTimeout(() => {
            if (projectKey === 'navigation') {
                printTerm("=================================================");
                printTerm("   Rowan University Campus Navigation System     ");
                printTerm("=================================================");
                printTerm("Status: Graph successfully loaded with 15 nodes.");
                printMenuNavigation();
            } else if (projectKey === 'toolkit') {
                printTerm("=================================================");
                printTerm("       Linux System Utility Toolkit v1.0.4       ");
                printTerm("=================================================");
                printMenuToolkit();
            } else if (projectKey === 'library') {
                printTerm("=================================================");
                printTerm("        Library Management System Database       ");
                printTerm("=================================================");
                printTerm("Status: OOP Data structures active (In-Memory).");
                printMenuLibrary();
            } else if (projectKey === 'calculator') {
                printTerm("=================================================");
                printTerm("           Student Grade Calculator              ");
                printTerm("=================================================");
                printMenuCalculator();
            }
        }, 300);
    }

    // Option menu outputs
    function printMenuNavigation() {
        printTerm("\n--- OPTIONS MENU ---");
        printTerm("1. Find Shortest Route (Dijkstra)");
        printTerm("2. View Campus Map Connections");
        printTerm("3. Toggle Road Blockage (Construction)");
        printTerm("4. View Active Blockages");
        printTerm("5. Reset All Blockages");
        printTerm("6. Clear screen");
        printTerm("--------------------");
    }

    function printMenuToolkit() {
        printTerm("\n--- SYSTEM AUTOMATION UTILITIES ---");
        printTerm("1. Scan Mounted Filesystems (disk_monitor.sh)");
        printTerm("2. System Health Diagnostics (system_diagnostics.sh)");
        printTerm("3. Process Manager Terminal (process_manager.sh)");
        printTerm("4. File Backup & Tar Compression (backup_utility.sh)");
        printTerm("5. User & Permission Audit Checklist (user_audit.sh)");
        printTerm("6. Clear Screen");
        printTerm("--------------------");
    }

    function printMenuLibrary() {
        printTerm("\n--- DATABASE OPERATIONS ---");
        printTerm("1. View Book Catalog");
        printTerm("2. Search for Book by Title/ISBN");
        printTerm("3. Register New Student");
        printTerm("4. View Registered Students");
        printTerm("5. Checkout Book (Borrow)");
        printTerm("6. Return Borrowed Book");
        printTerm("7. Reset In-Memory Database");
        printTerm("8. Clear Screen");
        printTerm("--------------------");
    }

    function printMenuCalculator() {
        printTerm("\n--- CALCULATOR MODULES ---");
        printTerm("1. Compute Subject Average (Interactive)");
        printTerm("2. View Standard Rowan Grade Scale");
        printTerm("3. Clear Screen");
        printTerm("--------------------");
    }

    // -------------------------------------------------
    // 3. Command Evaluator (Simulator Logic)
    // -------------------------------------------------
    function evaluateCommand(input) {
        const cmd = input.trim();
        if (cmd === '') return;

        printTerm(`${promptSign.innerText}${cmd}`, 'input-echo');

        // Main Router by Project
        if (currentProject === 'navigation') {
            handleNavigationCLI(cmd);
        } else if (currentProject === 'toolkit') {
            handleToolkitCLI(cmd);
        } else if (currentProject === 'library') {
            handleLibraryCLI(cmd);
        } else if (currentProject === 'calculator') {
            handleCalculatorCLI(cmd);
        }
    }

    // CLI Handlers
    // 3.1 Campus Navigation System Simulation
    function handleNavigationCLI(cmd) {
        if (termState === 'MENU') {
            switch (cmd) {
                case '1':
                    termState = 'NAV_START';
                    printTerm("\nAvailable Locations:");
                    campusMap.nodes.forEach((node, i) => printTerm(`  ${i + 1}. ${node}`));
                    printTerm("\nEnter START location name or index: ", 'warning');
                    break;
                case '2':
                    printTerm("\n--- Campus Map (Active Connections) ---");
                    printTerm("Chamberlain Student Center is connected to:");
                    printTerm("  -> Campbell Library          [120 meters]");
                    printTerm("  -> Savitz Hall               [150 meters]");
                    printTerm("Campbell Library is connected to:");
                    printTerm("  -> Robinson Hall             [100 meters]");
                    printTerm("  -> Savitz Hall               [110 meters]");
                    printTerm("Robinson Hall is connected to:");
                    printTerm("  -> Science Hall              [80 meters]");
                    printTerm("Science Hall is connected to:");
                    printTerm("  -> Rowan Hall                [130 meters]");
                    printTerm("  -> Engineering Hall          [150 meters]");
                    printTerm("Rowan Hall is connected to:");
                    printTerm("  -> Engineering Hall          [50 meters]");
                    printTerm("  -> Bozorth Hall              [210 meters]");
                    printMenuNavigation();
                    break;
                case '3':
                    termState = 'BLOCK_NODE';
                    printTerm("\nEnter location name or index to block (Construction): ", 'warning');
                    break;
                case '4':
                    printTerm("\n--- Active Blockages ---");
                    if (campusMap.blockages.nodes.length === 0) {
                        printTerm("No locations are currently blocked. Roads are fully open.");
                    } else {
                        printTerm(`Blocked Nodes: ${campusMap.blockages.nodes.join(', ')}`, 'error');
                    }
                    printMenuNavigation();
                    break;
                case '5':
                    campusMap.blockages.nodes = [];
                    printTerm("\n✓ Map blockages reset. All roads open.", 'success');
                    printMenuNavigation();
                    break;
                case '6':
                    consoleBody.innerHTML = '';
                    printMenuNavigation();
                    break;
                default:
                    printTerm("[Error] Unknown command. Please select an option (1-6).", 'error');
            }
        } else if (termState === 'NAV_START') {
            let val = parseInt(cmd);
            let loc = isNaN(val) ? cmd : campusMap.nodes[val - 1];
            
            if (loc && campusMap.nodes.includes(loc)) {
                inputBuffer.push(loc);
                termState = 'NAV_END';
                printTerm(`Start Set: ${loc}`, 'success');
                printTerm("Enter DESTINATION location name or index: ", 'warning');
            } else {
                printTerm("[Error] Invalid location. Try again: ", 'error');
            }
        } else if (termState === 'NAV_END') {
            let val = parseInt(cmd);
            let loc = isNaN(val) ? cmd : campusMap.nodes[val - 1];
            
            if (loc && campusMap.nodes.includes(loc)) {
                const start = inputBuffer[0];
                printTerm(`Destination Set: ${loc}`, 'success');
                
                printTerm(`\nCalculating shortest path from [${start}] to [${loc}] using Dijkstra's algorithm...`);
                
                // Mock Dijkstra Calculations
                setTimeout(() => {
                    if (campusMap.blockages.nodes.includes(start) || campusMap.blockages.nodes.includes(loc)) {
                        printTerm(`[No Route Found] Either start or destination is currently blocked.`, 'error');
                    } else if (start === loc) {
                        printTerm(`Distance: 0 meters. You are already there!`, 'success');
                    } else {
                        // Generate a pretty mock path based on locations
                        if (campusMap.blockages.nodes.includes("Savitz Hall") && start === "Chamberlain Student Center" && loc === "Robinson Hall") {
                            printTerm("Savitz Hall is blocked! Recalculating alternative path...", "warning");
                            printTerm("Path: Chamberlain Student Center -> Campbell Library -> Robinson Hall", "success");
                            printTerm("Total Weighted Distance: 220 meters", "success");
                        } else {
                            printTerm(`Path: ${start} -> Campbell Library -> Robinson Hall -> ${loc}`, 'success');
                            printTerm(`Total Weighted Distance: 340 meters (O(E log V) complexity)`, 'success');
                        }
                    }
                    termState = 'MENU';
                    inputBuffer = [];
                    printMenuNavigation();
                }, 400);
            } else {
                printTerm("[Error] Invalid location. Try again: ", 'error');
            }
        } else if (termState === 'BLOCK_NODE') {
            let val = parseInt(cmd);
            let loc = isNaN(val) ? cmd : campusMap.nodes[val - 1];
            
            if (loc && campusMap.nodes.includes(loc)) {
                if (campusMap.blockages.nodes.includes(loc)) {
                    campusMap.blockages.nodes = campusMap.blockages.nodes.filter(n => n !== loc);
                    printTerm(`✓ Location [${loc}] is now UNBLOCKED.`, 'success');
                } else {
                    campusMap.blockages.nodes.push(loc);
                    printTerm(`⚠️ Location [${loc}] is now BLOCKED (Construction zone active).`, 'error');
                }
                termState = 'MENU';
                printMenuNavigation();
            } else {
                printTerm("[Error] Invalid location. Try again: ", 'error');
            }
        }
    }

    // 3.2 Linux System Utility Toolkit Simulation
    function handleToolkitCLI(cmd) {
        if (termState === 'MENU') {
            switch (cmd) {
                case '1':
                    printTerm("\nExecuting ./disk_monitor.sh ...", "warning");
                    setTimeout(() => {
                        printTerm("Scanning Mounted Filesystems...");
                        printTerm("✓ OK: /dev/disk1s1s1 (/)       -> 68% used (120GB/180GB, 60GB free)", "success");
                        printTerm("✓ OK: /dev/disk1s3 (System)    -> 44% used (10GB/22GB, 12GB free)", "success");
                        printTerm("⚠️ WARNING: /dev/disk2 (Backup)  -> 82% used (410GB/500GB)", "error");
                        printTerm("\nTop 3 Space-Consuming files in current dir:");
                        printTerm("  1.2G  ./projects/library-system/target/db_archive.dump");
                        printTerm("  450M  ./portfolio/assets/videos/profile_intro.mp4");
                        printTerm("  120M  ./projects/campus-navigation/bin/CampusNavigationApp.class");
                        printMenuToolkit();
                    }, 400);
                    break;
                case '2':
                    printTerm("\nExecuting ./system_diagnostics.sh ...", "warning");
                    setTimeout(() => {
                        printTerm(`Operating System: macOS (${navigator.platform})`);
                        printTerm("CPU load profile: 4 Cores | 1.8GHz | load average: 1.25, 0.98, 0.44");
                        printTerm("Memory RAM details: Total: 16.00GB | Free: 4.88GB | Active: 11.12GB");
                        printTerm("Network: IP -> 192.168.1.144 | Interface -> en0");
                        printTerm("Connection Test: Ping to Google DNS 8.8.8.8 successful (24ms)", "success");
                        printMenuToolkit();
                    }, 500);
                    break;
                case '3':
                    termState = 'TOOL_KILL';
                    printTerm("\nListing running processes:", "warning");
                    printTerm("  PID   CPU%   MEM%   CMD");
                    printTerm("  2841  12.4   2.4    java -cp bin projects.campusnavigation.CampusNavigationApp");
                    printTerm("  2904  1.2    0.8    python3 grade_calculator.py");
                    printTerm("  1840  0.5    1.2    code (VS Code)");
                    printTerm("  3044  0.0    0.1    /bin/bash ./toolkit.sh");
                    printTerm("\nEnter PID to kill (or 'q' to quit process manager): ", 'warning');
                    break;
                case '4':
                    printTerm("\nExecuting ./backup_utility.sh ./portfolio ./backups ...", "warning");
                    setTimeout(() => {
                        printTerm("Initializing compression archive folder...");
                        printTerm("✓ Archive created: ./backups/backup_20260609_1315.tar.gz (Size: 840KB)", "success");
                        printTerm("Retention check: Active backups count is 3 (limit: 5). No pruning required.", "success");
                        printMenuToolkit();
                    }, 500);
                    break;
                case '5':
                    printTerm("\nExecuting ./user_audit.sh ...", "warning");
                    setTimeout(() => {
                        printTerm("Logged-in Sessions:");
                        printTerm(`  saiaakash   console   ${new Date().toLocaleDateString()}`);
                        printTerm("\nAuditing World-Writable Files:");
                        printTerm("✓ Scan Completed: No world-writable file hazards found.", "success");
                        printMenuToolkit();
                    }, 400);
                    break;
                case '6':
                    consoleBody.innerHTML = '';
                    printMenuToolkit();
                    break;
                default:
                    printTerm("[Error] Unknown option. Select 1-6.", 'error');
            }
        } else if (termState === 'TOOL_KILL') {
            if (cmd === 'q') {
                termState = 'MENU';
                printTerm("Exiting process manager.");
                printMenuToolkit();
                return;
            }
            let pid = parseInt(cmd);
            if (!isNaN(pid)) {
                printTerm(`Terminating PID ${pid}...`, 'warning');
                setTimeout(() => {
                    printTerm(`✓ Process ${pid} successfully killed.`, 'success');
                    termState = 'MENU';
                    printMenuToolkit();
                }, 400);
            } else {
                printTerm("Invalid PID. Enter digits or 'q' to exit: ", 'error');
            }
        }
    }

    // 3.3 Library Management System Simulation
    function handleLibraryCLI(cmd) {
        if (termState === 'MENU') {
            switch (cmd) {
                case '1':
                    printTerm("\n--- Current Book Inventory ---");
                    libraryDb.books.forEach(b => {
                        printTerm(`ISBN: ${b.isbn} | Title: ${b.title.padEnd(25)} | Author: ${b.author.padEnd(15)} | Stock: ${b.qty}`);
                    });
                    printMenuLibrary();
                    break;
                case '2':
                    termState = 'LIB_SEARCH';
                    printTerm("\nEnter keyword (title/ISBN): ", 'warning');
                    break;
                case '3':
                    termState = 'LIB_REG_ID';
                    printTerm("\nEnter Student ID (e.g. S103): ", 'warning');
                    break;
                case '4':
                    printTerm("\n--- Registered Students Directory ---");
                    libraryDb.students.forEach(s => {
                        printTerm(`ID: ${s.id} | Name: ${s.name.padEnd(18)} | Checked Out: [${s.borrowed.join(', ')}]`);
                    });
                    printMenuLibrary();
                    break;
                case '5':
                    termState = 'LIB_BORROW_ID';
                    printTerm("\nEnter Student ID: ", 'warning');
                    break;
                case '6':
                    termState = 'LIB_RETURN_ID';
                    printTerm("\nEnter Student ID: ", 'warning');
                    break;
                case '7':
                    libraryDb.books[0].qty = "4/5";
                    libraryDb.books[1].qty = "2/3";
                    libraryDb.students = [
                        { id: "S101", name: "Likhita Bandaru", borrowed: ["Effective Java"] },
                        { id: "S102", name: "Alex Rivera", borrowed: ["Clean Code"] }
                    ];
                    printTerm("\n✓ Database reset to seed values.", 'success');
                    printMenuLibrary();
                    break;
                case '8':
                    consoleBody.innerHTML = '';
                    printMenuLibrary();
                    break;
                default:
                    printTerm("[Error] Unknown menu selection. Select 1-8.", 'error');
            }
        } else if (termState === 'LIB_SEARCH') {
            const results = libraryDb.books.filter(b => b.title.toLowerCase().includes(cmd.toLowerCase()) || b.isbn.includes(cmd));
            printTerm(`\nSearch results (${results.length} found):`);
            results.forEach(b => {
                printTerm(`ISBN: ${b.isbn} | ${b.title} by ${b.author} (${b.qty})`, 'success');
            });
            termState = 'MENU';
            printMenuLibrary();
        } else if (termState === 'LIB_REG_ID') {
            inputBuffer.push(cmd);
            termState = 'LIB_REG_NAME';
            printTerm("Enter Name: ", 'warning');
        } else if (termState === 'LIB_REG_NAME') {
            const id = inputBuffer[0];
            libraryDb.students.push({
                id: id,
                name: cmd,
                borrowed: []
            });
            printTerm(`✓ Student ${cmd} registered successfully with ID ${id}.`, 'success');
            inputBuffer = [];
            termState = 'MENU';
            printMenuLibrary();
        } else if (termState === 'LIB_BORROW_ID') {
            const student = libraryDb.students.find(s => s.id === cmd);
            if (student) {
                inputBuffer.push(cmd);
                termState = 'LIB_BORROW_ISBN';
                printTerm("Enter Book ISBN or Title: ", 'warning');
            } else {
                printTerm("[Error] Student ID not found. Return to menu.", 'error');
                termState = 'MENU';
                printMenuLibrary();
            }
        } else if (termState === 'LIB_BORROW_ISBN') {
            const studentId = inputBuffer[0];
            const book = libraryDb.books.find(b => b.isbn === cmd || b.title.toLowerCase().includes(cmd.toLowerCase()));
            
            if (book) {
                const student = libraryDb.students.find(s => s.id === studentId);
                if (student.borrowed.includes(book.title)) {
                    printTerm("[Error] Student already checked out this title.", 'error');
                } else {
                    student.borrowed.push(book.title);
                    book.qty = `${parseInt(book.qty.split('/')[0]) - 1}/${book.qty.split('/')[1]}`;
                    printTerm(`✓ Book "${book.title}" successfully checked out by ${student.name}!`, 'success');
                }
            } else {
                printTerm("[Error] Book not found.", 'error');
            }
            inputBuffer = [];
            termState = 'MENU';
            printMenuLibrary();
        } else if (termState === 'LIB_RETURN_ID') {
            const student = libraryDb.students.find(s => s.id === cmd);
            if (student) {
                inputBuffer.push(cmd);
                termState = 'LIB_RETURN_ISBN';
                printTerm("Enter Book ISBN or Title: ", 'warning');
            } else {
                printTerm("[Error] Student ID not found.", 'error');
                termState = 'MENU';
                printMenuLibrary();
            }
        } else if (termState === 'LIB_RETURN_ISBN') {
            const studentId = inputBuffer[0];
            const student = libraryDb.students.find(s => s.id === studentId);
            const book = libraryDb.books.find(b => b.isbn === cmd || b.title.toLowerCase().includes(cmd.toLowerCase()));
            
            if (book && student.borrowed.includes(book.title)) {
                student.borrowed = student.borrowed.filter(t => t !== book.title);
                book.qty = `${parseInt(book.qty.split('/')[0]) + 1}/${book.qty.split('/')[1]}`;
                printTerm(`✓ Book "${book.title}" returned successfully.`, 'success');
            } else {
                printTerm("[Error] Transaction failed. Book not on user's borrowed list.", 'error');
            }
            inputBuffer = [];
            termState = 'MENU';
            printMenuLibrary();
        }
    }

    // 3.4 Student Grade Calculator Simulation
    function handleCalculatorCLI(cmd) {
        if (termState === 'MENU') {
            switch (cmd) {
                case '1':
                    termState = 'CALC_NAME';
                    printTerm("\nEnter Course/Subject Name (e.g. Data Structures): ", 'warning');
                    break;
                case '2':
                    printTerm("\n--- Rowan Standard Grading Scale ---");
                    printTerm("  A  : >= 93% (4.0)   |   C+ : >= 77% (2.3)");
                    printTerm("  A- : >= 90% (3.7)   |   C  : >= 73% (2.0)");
                    printTerm("  B+ : >= 87% (3.3)   |   C- : >= 70% (1.7)");
                    printTerm("  B  : >= 83% (3.0)   |   D  : >= 60% (1.0)");
                    printTerm("  B- : >= 80% (2.7)   |   F  : < 60%  (0.0)");
                    printMenuCalculator();
                    break;
                case '3':
                    consoleBody.innerHTML = '';
                    printMenuCalculator();
                    break;
                default:
                    printTerm("[Error] Select option 1-3.", 'error');
            }
        } else if (termState === 'CALC_NAME') {
            tempGradeData.course = cmd;
            termState = 'CALC_CAT_NAME';
            printTerm("Enter Category Name (e.g. Exams): ", 'warning');
        } else if (termState === 'CALC_CAT_NAME') {
            inputBuffer.push(cmd); // Save category name
            termState = 'CALC_CAT_WEIGHT';
            printTerm("Enter Category Weight (e.g. 40): ", 'warning');
        } else if (termState === 'CALC_CAT_WEIGHT') {
            let weight = parseFloat(cmd);
            if (!isNaN(weight) && weight > 0 && weight <= 100) {
                inputBuffer.push(weight); // Save weight
                termState = 'CALC_CAT_GRADE';
                printTerm("Enter Score obtained (0-100): ", 'warning');
            } else {
                printTerm("[Error] Weight must be between 1 and 100. Try again: ", 'error');
            }
        } else if (termState === 'CALC_CAT_GRADE') {
            let grade = parseFloat(cmd);
            if (!isNaN(grade) && grade >= 0 && grade <= 100) {
                const catName = inputBuffer[0];
                const catWeight = inputBuffer[1];
                
                tempGradeData.categories.push({
                    name: catName,
                    weight: catWeight,
                    grade: grade
                });
                
                printTerm(`Category Added: ${catName} (${catWeight}% weight) | Score: ${grade}`, 'success');
                
                // Ask if they want another category or finish
                inputBuffer = [];
                termState = 'CALC_ASK_NEXT';
                printTerm("\nDo you want to add another category? (y/n): ", 'warning');
            } else {
                printTerm("[Error] Grade must be 0-100. Try again: ", 'error');
            }
        } else if (termState === 'CALC_ASK_NEXT') {
            if (cmd.toLowerCase().startsWith('y')) {
                termState = 'CALC_CAT_NAME';
                printTerm("\nEnter Category Name: ", 'warning');
            } else {
                // Compute final Grade
                let totalWeight = 0;
                let finalScore = 0;
                tempGradeData.categories.forEach(c => {
                    totalWeight += c.weight;
                    finalScore += (c.grade * (c.weight / 100));
                });
                
                // Normalize if weights are not 100
                if (totalWeight !== 100 && totalWeight > 0) {
                    printTerm(`\n[Notice] Weight total was ${totalWeight}%. Normalizing to 100%...`, 'warning');
                    finalScore = (finalScore / totalWeight) * 100;
                }
                
                // Determine Letter
                let letter = 'F';
                let gpa = 0.0;
                if (finalScore >= 93) { letter = 'A'; gpa = 4.0; }
                else if (finalScore >= 90) { letter = 'A-'; gpa = 3.7; }
                else if (finalScore >= 87) { letter = 'B+'; gpa = 3.3; }
                else if (finalScore >= 83) { letter = 'B'; gpa = 3.0; }
                else if (finalScore >= 80) { letter = 'B-'; gpa = 2.7; }
                else if (finalScore >= 77) { letter = 'C+'; gpa = 2.3; }
                else if (finalScore >= 73) { letter = 'C'; gpa = 2.0; }
                else if (finalScore >= 70) { letter = 'C-'; gpa = 1.7; }
                else if (finalScore >= 60) { letter = 'D'; gpa = 1.0; }
                
                // Display card
                printTerm(`\n=================================================`);
                printTerm(`            GRADE REPORT: ${tempGradeData.course.toUpperCase()}`);
                printTerm(`=================================================`);
                tempGradeData.categories.forEach(c => {
                    printTerm(`${c.name.padEnd(20)} : Weight: ${c.weight}% | Score: ${c.grade}`);
                });
                printTerm(`-------------------------------------------------`);
                printTerm(`FINAL SCORE  : ${finalScore.toFixed(2)}%`, 'success');
                printTerm(`LETTER GRADE : ${letter} (GPA: ${gpa.toFixed(1)})`, 'success');
                printTerm(`=================================================`);
                
                // Reset
                tempGradeData = { course: "", categories: [] };
                termState = 'MENU';
                printMenuCalculator();
            }
        }
    }

    // Capture terminal inputs
    consoleInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const input = consoleInput.value;
            evaluateCommand(input);
            consoleInput.value = '';
        }
    });

    // Make tabs clickable to change projects
    projectTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            projectTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const projectKey = tab.getAttribute('data-project');
            const meta = projectsMeta[projectKey];
            
            metaTitle.innerText = meta.title;
            metaDesc.innerText = meta.desc;
            
            // Local path links adjustment
            const repoLink = document.getElementById('projectRepoLocalLink');
            if (repoLink) {
                repoLink.href = `../projects/${projectKey === 'navigation' ? 'campus-navigation-system' : projectKey === 'toolkit' ? 'linux-system-utility-toolkit' : projectKey === 'library' ? 'library-management-system' : 'student-grade-calculator'}`;
            }

            initTerminal(projectKey);
        });
    });

    // Boot current active project (first item)
    initTerminal('navigation');

    // -------------------------------------------------
    // 4. Interactive Contact Form Submission
    // -------------------------------------------------
    const contactForm = document.getElementById('portfolioContactForm');
    const contactSpinner = document.getElementById('contactFormSpinner');
    const contactStatus = document.getElementById('contactFormStatus');
    const submitBtnText = document.querySelector('#contactSubmitButton span');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show loading indicators
            contactSpinner.style.display = 'block';
            submitBtnText.style.opacity = '0.5';
            contactStatus.innerText = '';
            contactStatus.style.color = '#ffffff';

            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const subject = document.getElementById('contactSubject').value;
            const message = document.getElementById('contactMessage').value;

            // Mock latency
            setTimeout(() => {
                // Save to localStorage
                const messagesList = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
                messagesList.push({
                    name,
                    email,
                    subject,
                    message,
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem('portfolio_messages', JSON.stringify(messagesList));

                // Update UI state
                contactSpinner.style.display = 'none';
                submitBtnText.style.opacity = '1';
                contactStatus.innerText = '✓ Message successfully sent! Saved to browser local storage.';
                contactStatus.style.color = '#10b981';

                // Reset fields
                contactForm.reset();
            }, 1500);
        });
    }
});
