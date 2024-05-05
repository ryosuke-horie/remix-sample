import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Links,
  Meta,
  NavLink,
  Scripts,
  ScrollRestoration,
  Outlet,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
// Note: CSSファイルをJSモジュールに直接インポートできる。
import appStylesHref from "./app.css?url";

import { createEmptyContact, getContacts } from "./data";

// Note: HTMLについて
// Note: form要素はリンクのようにブラウザ内のナビゲーションをトリガーする。
// Note: リンクはURLのみを変更するが、formはGET, POSTのリクエストやリクエストBodyを送信する。
// Note: Remixではリクエストをサーバーに送信する代わりにクライアント側のルーティングを使用し送信する

// Note: Formによってブラウザがサーバーにリクエストを送信する代わりに、
// Note: Remixはクライアント側のルーティングを使用してページを更新する。
// Note: WEB標準で、POSTは一部のデータが変更されていることを示し、
// Note: 慣例に従い、Remixは自動的にデータを再検証する
export const action = async () => {
  // Note: 空の連絡先を作成する
  const contact = await createEmptyContact();
  return json({ contact });
};

// RemixのLinksにCSSモジュールを適用する
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];

// Note:data.tsからデータを取得するローダー
export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return json({ contacts });
};

/**
 * Note: UIで最初にレンダリングされる。
 * Note：通常はページのグローバルレイアウトが含まれる。
 */
export default function App() {
  const { contacts } = useLoaderData<typeof loader>();
  // Note: Remixは次のページのデータを読み込むまで、古いページを表示しない。
  // Note: UXの向上のため、ユーザーにフィードバックするため以下を使用する   
  const navigation = useNavigation();

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
                    <NavLink
                  className={({ isActive, isPending }) =>
                    isActive
                      ? "active"
                      : isPending
                      ? "pending"
                      : ""
                  }
                  to={`contacts/${contact.id}`}
                >
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
                    </NavLink>
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
         <div className={
            navigation.state === "loading" ? "loading" : ""
          } id="detail">
          <Outlet />
        </div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
