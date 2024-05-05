import type { LinksFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  Outlet,
  useLoaderData,
} from "@remix-run/react";
// Note: CSSファイルをJSモジュールに直接インポートできる。
import appStylesHref from "./app.css?url";

import { getContacts } from "./data";

// Note: HTMLについて
// Note: form要素はリンクのようにブラウザ内のナビゲーションをトリガーする。
// Note: リンクはURLのみを変更するが、formはGET, POSTのリクエストやリクエストBodyを送信する。
// Note: Remixではリクエストをサーバーに送信する代わりにクライアント側のルーティングを使用し送信する

// RemixのLinksにCSSモジュールを適用する
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];

// Note:data.tsからデータを取得するローダー
export const loader = async () => {
  const contacts = await getContacts();
  return json({ contacts });
};

/**
 * Note: UIで最初にレンダリングされる。
 * Note：通常はページのグローバルレイアウトが含まれる。
 */
export default function App() {
  const { contacts } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <h1>Remix Contacts</h1>
          <div>
            <Form id="search-form" role="search">
              <input
                id="q"
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
              />
              <div id="search-spinner" aria-hidden hidden={true} />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
            {contacts.length ? (
              <ul>
                {contacts.map((contact) => (
                  <li key={contact.id}>
                    <Link to={`contacts/${contact.id}`}>
                      {contact.first || contact.last ? (
                        <>
                          {contact.first} {contact.last}
                        </>
                      ) : (
                        <i>No Name</i>
                      )}{" "}
                      {contact.favorite ? (
                        <span>★</span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <i>No contacts</i>
              </p>
            )}

          </nav>
        </div>

        {/* Note: 子ルートがアウトレットを通じてレンダリングされる */}
         <div id="detail">
          <Outlet />
        </div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
