const fs = require("fs");

// Add onRowClick to every DataTable that has a details view, so clicking
// anywhere on a row opens the same drawer the "View Details" menu item opens.
const tables = [
  {
    file: "src/components/admin/companies/companies-table.tsx",
    anchor: '        emptyMessage="No companies found"',
    add: '        onRowClick={(item) => handleView(item)}\n',
    note: "company drawer (view)",
  },
  {
    file: "src/components/admin/employees/employee-table.tsx",
    anchor: '        emptyMessage="No employees found"',
    add: "        onRowClick={(item: any) => {\n          setDrawerEmployee(item);\n          setDrawerMode(\"view\");\n        }}\n",
    note: "employee drawer (view)",
  },
  {
    file: "src/components/admin/individual/individual-registrations.tsx",
    anchor: '          emptyMessage="No individual registrations found"',
    add: "          onRowClick={(item: any) => {\n            setDrawerRegistration(item);\n            setDrawerMode(\"view\");\n            setInitialTab(\"details\");\n          }}\n",
    note: "individual drawer",
  },
  {
    file: "src/components/admin/registrations/group-life-registrations.tsx",
    anchor: '          emptyMessage="No group life registrations found"',
    add: "          onRowClick={(item: any) => {\n            setDrawerRegistration(item);\n            setDrawerMode(\"view\");\n            setInitialTab(\"details\");\n          }}\n",
    note: "group life drawer",
  },
  {
    file: "src/components/admin/registrations/employee-group-life-registrations.tsx",
    anchor: '          emptyMessage="No employee group life registrations found"',
    add: "          onRowClick={(item: any) => {\n            setDrawerRegistration(item);\n            setDrawerMode(\"view\");\n            setInitialTab(\"details\");\n          }}\n",
    note: "employee group life drawer",
  },
  {
    file: "src/components/admin/registrations/corporate-registrations.tsx",
    anchor: '          emptyMessage="No corporate registrations found"',
    add: "          onRowClick={(item: any) => {\n            setDrawerRegistration(item);\n            setDrawerMode(\"view\");\n            setInitialTab(\"details\");\n          }}\n",
    note: "corporate drawer",
  },
  {
    file: "src/app/admin/policies/page.tsx",
    anchor: '        emptyMessage="No policies found"',
    add: "        onRowClick={(item) => {\n          setSelectedPolicy(item);\n          setShowDetailSheet(true);\n        }}\n",
    note: "policy detail sheet",
  },
  {
    file: "src/components/admin/verification/nin-verifications.tsx",
    anchor: '          emptyMessage={',
    add: "          onRowClick={(item: any) => setDrawerVerification(item)}\n",
    note: "verification drawer",
  },
];

for (const t of tables) {
  let raw = fs.readFileSync(t.file, "utf8");
  const crlf = raw.includes("\r\n");
  let s = crlf ? raw.replace(/\r\n/g, "\n") : raw;

  if (s.split(t.anchor).length - 1 !== 1) {
    console.error("ANCHOR FAIL " + t.file);
    process.exit(1);
  }
  if (s.includes("onRowClick")) {
    console.error("ALREADY HAS onRowClick: " + t.file);
    process.exit(1);
  }
  s = s.replace(t.anchor, t.add + t.anchor);
  fs.writeFileSync(t.file, crlf ? s.replace(/\n/g, "\r\n") : s);
  console.log("OK: " + t.file + " (" + t.note + ")");
}
