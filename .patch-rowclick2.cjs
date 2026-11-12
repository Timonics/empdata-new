const fs = require("fs");

// Remaining tables (companies handled separately — had a commented-out prop)
const tables = [
  {
    file: "src/components/admin/employees/employee-table.tsx",
    anchor: '        emptyMessage="No employees found"',
    add: "        onRowClick={(item: any) => {\n          setDrawerEmployee(item);\n          setDrawerMode(\"view\");\n        }}\n",
  },
  {
    file: "src/components/admin/individual/individual-registrations.tsx",
    anchor: '          emptyMessage="No individual registrations found"',
    add: "          onRowClick={(item: any) => {\n            setDrawerRegistration(item);\n            setDrawerMode(\"view\");\n            setInitialTab(\"details\");\n          }}\n",
  },
  {
    file: "src/components/admin/registrations/group-life-registrations.tsx",
    anchor: '          emptyMessage="No group life registrations found"',
    add: "          onRowClick={(item: any) => {\n            setDrawerRegistration(item);\n            setDrawerMode(\"view\");\n            setInitialTab(\"details\");\n          }}\n",
  },
  {
    file: "src/components/admin/registrations/employee-group-life-registrations.tsx",
    anchor: "No employee group life registrations found\"",
    add: "",
    fullAnchor: '          emptyMessage="No employee group life registrations found"',
    fullAdd: "          onRowClick={(item: any) => {\n            setDrawerRegistration(item);\n            setDrawerMode(\"view\");\n            setInitialTab(\"details\");\n          }}\n",
  },
  {
    file: "src/components/admin/registrations/corporate-registrations.tsx",
    anchor: '          emptyMessage="No corporate registrations found"',
    add: "          onRowClick={(item: any) => {\n            setDrawerRegistration(item);\n            setDrawerMode(\"view\");\n            setInitialTab(\"details\");\n          }}\n",
  },
  {
    file: "src/app/admin/policies/page.tsx",
    anchor: '        emptyMessage="No policies found"',
    add: "        onRowClick={(item) => {\n          setSelectedPolicy(item);\n          setShowDetailSheet(true);\n        }}\n",
  },
  {
    file: "src/components/admin/verification/nin-verifications.tsx",
    anchor: "          emptyMessage={",
    add: "          onRowClick={(item: any) => setDrawerVerification(item)}\n",
  },
];

for (const t of tables) {
  const anchor = t.fullAnchor || t.anchor;
  const add = t.fullAdd || t.add;

  let raw = fs.readFileSync(t.file, "utf8");
  const crlf = raw.includes("\r\n");
  let s = crlf ? raw.replace(/\r\n/g, "\n") : raw;

  // Allow already-active onRowClick to be skipped if identical
  if (s.includes(add.trim())) {
    console.log("SKIP (already): " + t.file);
    continue;
  }
  const activeRe = /onRowClick=\{/;
  if (activeRe.test(s)) {
    console.error("ACTIVE onRowClick EXISTS: " + t.file);
    process.exit(1);
  }
  if (s.split(anchor).length - 1 !== 1) {
    console.error("ANCHOR FAIL " + t.file + " :: " + JSON.stringify(anchor.slice(0, 40)));
    process.exit(1);
  }
  s = s.replace(anchor, add + anchor);
  fs.writeFileSync(t.file, crlf ? s.replace(/\n/g, "\r\n") : s);
  console.log("OK: " + t.file);
}
