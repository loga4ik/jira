/** Заглушка на время загрузки. role="status" — скринридер её озвучит. */
export const PageLoader = ({ text = "загрузка…" }: { text?: string }) => (
  <p role="status" className="p-3 text-center opacity-60">
    {text}
  </p>
);
