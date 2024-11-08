import { UploadIcon } from '@components/icons/upload-icon';
import { useEffect, useState, useCallback } from 'react';
import { useDropzone, FileWithPath } from 'react-dropzone';
import { useUploadMutation } from '@framework/upload/upload.query';
import Spinner from '@components/ui/loaders/spinner/spinner';
import { useTranslation } from 'next-i18next';
import { Attachment } from '../types';
import { CloseIcon } from '../../../components/icons/close-icon';
import Loader from '../../../components/ui/loaders/loader/loader';


const getPreviewImage = (value: any) => {
  let images: any[] = [];
  if (value) {
    images = Array.isArray(value) ? value : [{ ...value }];
  }
  return images;
};
export default function Uploader({ onChange, value, multiple }: any) {
  const { t } = useTranslation();
  const [files, setFiles] = useState<Attachment[]>(getPreviewImage(value));
  const { mutate: upload, isLoading: loading } = useUploadMutation();
  
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    multiple,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length) {
        upload(
          acceptedFiles, // it will be an array of uploaded attachments
          {
            onSuccess: (data:any) => {
              let newData=data.map((file:any)=>{
                return ({ 
                  thumbnail:file.Location,
                  original:file.Location 
                })
              })
              let mergedData;
              if (multiple) {
                mergedData = files.concat(newData);
                setFiles(mergedData);
              } else {
                mergedData = [{...newData[0]}];
                setFiles(mergedData);
              }
              if (onChange) {
                if(multiple) {
                  onChange(mergedData);
                }else{
                  onChange(mergedData[0]);  
                }
              }
            },
          }
        );
      }
    },
  });
  

  const handleDelete = (image: string) => {
    const images = files.filter((file) => file.thumbnail !== image);

    setFiles(images);
    if (onChange) {
      onChange(images);
    }
  };
  const thumbs = files?.map((file: any, idx) => {
    if (1) {
      return (
        <div
          className="inline-flex flex-col overflow-hidden border border-border-200 rounded mt-2 me-2 relative"
          key={idx}
        >
          <div className="flex items-center justify-center min-w-0 w-16 h-16 overflow-hidden">
            <img src={file.thumbnail} />
          </div>
          {multiple ? (
            <button
              className="w-4 h-4 flex items-center justify-center rounded-full bg-red-600 text-xs text-light absolute top-1 end-1 shadow-xl outline-none"
              onClick={() => handleDelete(file.thumbnail)}
            >
              <CloseIcon width={10} height={10} />
            </button>
          ) : null}
        </div>
      );
    }
  });

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file: any) => URL.revokeObjectURL(file.thumbnail));
    },
    [files]
  );

  return (
    <section className="upload">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 border-border-base h-36 rounded flex flex-col justify-center items-center cursor-pointer focus:border-accent-400 focus:outline-none",
        })}
      >
        <input {...getInputProps()} />
        <UploadIcon className="text-muted-light" />
        <p className="text-body text-sm mt-4 text-center">
          <span className="text-accent font-semibold">
            {t("text-upload-highlight")}
          </span>{" "}
          {t("text-upload-message")} <br />
          <span className="text-xs text-body">{t("text-img-format")}</span>
        </p>
      </div>

      {(!!thumbs.length || loading) && (
        <aside className="flex flex-wrap mt-2">
          {!!thumbs.length && thumbs}
          {loading && (
            <div className="h-16 flex items-center mt-2 ms-2">
              <Loader simple={true} className="w-6 h-6" />
            </div>
          )}
        </aside>
      )}
    </section>
  );
}
















// const getPreviewImage = (value: any) => {
//   let images: any[] = [];
//   // if (value) {
//   //   images = Array.isArray(value)
//   //     ? value.map(({ thumbnail }) => ({ preview: thumbnail }))
//   //     : [{ preview: value.thumbnail }];
//   // }
//   if (value) {
//     images = Array.isArray(value) ? value : [{ ...value }];
//   }
//   return images;
// };

// export default function Uploader({ onChange, value, name, onBlur }: any) {
//   const { t } = useTranslation('common');
//   const [files, setFiles] = useState<FileWithPath[]>(getPreviewImage(value));
//   const { mutate: upload, isLoading: loading } = useUploadMutation();

//   const onDrop = useCallback(
//     async (acceptedFiles) => {
//       upload(
//         acceptedFiles, // it will be an array of uploaded attachments
//         {
//           onSuccess: (data) => {
//             if (onChange) {
//               onChange(data);
//             }
//           },
//         }
//       );
//       setFiles(
//         acceptedFiles.map((file: any) =>
//           Object.assign(file, {
//             preview: URL.createObjectURL(file),
//           })
//         )
//       );
//     },
//     [onChange, upload]
//   );
//   const { getRootProps, getInputProps } = useDropzone({
//     accept: 'image/*',
//     multiple: false,
//     onDrop,
//   });

//   const thumbs = files.map((file: any, idx) => (
//     <div
//       className="inline-flex flex-col overflow-hidden border border-border-100 rounded mt-2 me-2 relative"
//       key={idx}
//     >
//       <div className="flex items-center justify-center min-w-0 w-16 h-16 overflow-hidden">
//         {/* eslint-disable */}
//         <img src={file.preview} alt={file?.name} />
//       </div>
//     </div>
//   ));

//   useEffect(
//     () => () => {
//       // Make sure to revoke the data uris to avoid memory leaks
//       files.forEach((file: any) => URL.revokeObjectURL(file.preview));
//     },
//     [files]
//   );

//   return (
//     <section className="upload">
//       <div
//         {...getRootProps({
//           className:
//             'border-dashed border-2 border-border-base h-36 rounded flex flex-col justify-center items-center cursor-pointer focus:border-accent-400 focus:outline-none',
//         })}
//       >
//         <input
//           {...getInputProps({
//             name,
//             onBlur,
//           })}
//         />
//         <UploadIcon className="text-muted-light" />
//         <p className="text-body text-sm mt-4 text-center">
//           <span className="text-accent font-semibold">
//             {t('text-upload-highlight')}
//           </span>{' '}
//           {t('text-upload-message')} <br />
//           <span className="text-xs text-body">{t('text-img-format')}</span>
//         </p>
//       </div>

//       {(!!thumbs.length || loading) && (
//         <aside className="flex flex-wrap mt-2">
//           {!!thumbs.length && thumbs}
//           {loading && (
//             <div className="h-16 flex items-center mt-2 ms-2">
//               <Spinner
//                 text={t('text-loading')}
//                 simple={true}
//                 className="w-6 h-6"
//               />
//             </div>
//           )}
//         </aside>
//       )}
//     </section>
//   );
// }
