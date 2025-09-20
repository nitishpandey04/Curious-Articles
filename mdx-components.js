import Image from 'next/image'

export function useMDXComponents(components) {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    h1: ({ children }) => (
      <h1 style={{ color: 'red', fontSize: '48px' }}>{children}</h1>
    ),
    img: (props) => (
      <Image
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
        {...props}
      />
    ),
    ...components,
  }
}

// export const mdxComponents = {
//   h1: (props) => <h1 className="text-3xl font-bold mt-6 mb-4" {...props} />,
//   p: (props) => <p className="text-gray-700 mb-4" {...props} />,
//   ul: (props) => <ul className="list-disc pl-6 mb-4" {...props} />,
//   code: (props) => <code className="bg-gray-100 p-1 rounded" {...props} />,
// };
