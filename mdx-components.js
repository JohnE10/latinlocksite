// mdx-components.js
const components = {
  h1: (props) => <h1 className="text-3xl font-bold my-4" {...props} />,
  h2: (props) => <h2 className="text-2xl font-semibold my-3" {...props} />,
  h3: (props) => <h2 className="text-xl font-semibold my-2" {...props} />,
  p: (props) => <p className="my-2 leading-relaxed" {...props} />,
  br: (props) => <br />,
  hr: (props) => <hr />,
};

export function useMDXComponents() {
  return components;
}