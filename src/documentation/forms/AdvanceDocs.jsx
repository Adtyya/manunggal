import React from 'react';
import { Uploader } from "@/components/reactdash-ui";

// components
import { Preloader, Row, Column, Card, Prism } from "@/components/reactdash-ui";

export default function AdvanceDocs() {
  // page title
  const page_title = "Advance";

  // prism code
  const datacode1 = `
import React from 'react'
import { Uploader } from "@/components/taildash-ui";

export default function InputExp() {
    return (
      <>
        <form action="" className="flex flex-col space-y-4">
          {/* drag drop upload */}
          <Uploader id="drop1" />

        </form>
      </>
    )
}
  `;

  return (
    <Preloader>
      {/* page title  */}
      <Row>
        <Column className="w-full md:w-1/2 px-4">   
          <p className="text-xl font-bold mt-3 mb-5">{page_title}</p>
        </Column>
      </Row>

      {/* content */}
      <Row>
        <Column className="w-full px-4">
          <Card className="relative p-6">
            <p className="text-lg mb-6 font-light">Advance input fields.</p>
            <h2 className="text-lg mb-4 font-semibold text-gray-800 dark:text-gray-300">Example Upload</h2>
            <Card className="relative p-6 border border-gray-200 dark:border-gray-700 shadow-none">
                {/* Advance */}
                <Uploader id="drop1"/>
            </Card>

            <div className="mt-5 mb-12">
              <Prism data={datacode1} />
            </div>

            <table className="table-default mb-12">
              <thead>
                <tr>
                  <th>Prop</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Default</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><b>id</b></td>
                  <td>id for dropzone</td>
                  <td><code>string</code></td>
                  <td><code>-</code></td>
                </tr>
              </tbody>
            </table>
          </Card>
        </Column>
      </Row>
    </Preloader>
  );
}