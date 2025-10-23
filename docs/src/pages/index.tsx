import Link from "@docusaurus/Link";

export default function Home() {
  return (
    <main style={{ padding: "4rem 0" }}>
      <section style={{ textAlign: "center" }}>
        <h1 style={{ marginBottom: "0.5rem" }}>ToolBox Documentation</h1>
        <p style={{ opacity: 0.8, marginBottom: "1.5rem" }}>
          Start here to install, use, and extend ToolBox (plugins, API, guides).
        </p>
        <div
          style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}
        >
          <Link
            className="button button--primary button--lg"
            to="/docs/getting-started"
          >
            Get Started
          </Link>
          <Link
            className="button button--secondary button--lg"
            href="https://github.com/rishabh3562/ToolBox"
          >
            GitHub
          </Link>
        </div>
      </section>
    </main>
  );
}
