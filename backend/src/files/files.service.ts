import { Injectable } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common/interfaces';
import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
  CreateBucketCommand,
  HeadBucketCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class FilesService implements OnModuleInit {
  private readonly bucketName =
    'clon-drive-bucket';

  private readonly s3 = new S3Client({
    region: 'us-east-1',
    endpoint:
      process.env.S3_ENDPOINT ??
      'http://localhost:4566',
    forcePathStyle: true,
    credentials: {
      accessKeyId: 'test',
      secretAccessKey: 'test',
    },
  });

  async onModuleInit() {
    await this.ensureBucketExists();
  }

  async ensureBucketExists() {
    try {
      await this.s3.send(
        new HeadBucketCommand({
          Bucket: this.bucketName,
        }),
      );
    } catch {
      await this.s3.send(
        new CreateBucketCommand({
          Bucket: this.bucketName,
        }),
      );

      console.log(
        `Bucket ${this.bucketName} creado automáticamente`,
      );
    }
  }

  async uploadFiles(
    files: Express.Multer.File[],
  ) {
    const uploadedFiles: any[] = [];
    for (const file of files) {
      const key = `${Date.now()}-${file.originalname}`;

      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      uploadedFiles.push({
        fileName: file.originalname,
        key,
      });
    }

    return {
      message:
        'Archivos subidos correctamente',
      files: uploadedFiles,
    };
  }

  async getRecentFiles() {
    const result = await this.s3.send(
      new ListObjectsV2Command({
        Bucket: this.bucketName,
      }),
    );

    const files = result.Contents ?? [];

    return files
      .sort((a, b) => {
        const dateA =
          a.LastModified?.getTime() ?? 0;
        const dateB =
          b.LastModified?.getTime() ?? 0;

        return dateB - dateA;
      })
      .slice(0, 3)
      .map((file) => ({
        key: file.Key,
        size: file.Size,
        lastModified: file.LastModified,
      }));
  }

  async downloadFile(key: string) {
    return await this.s3.send(
      new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }),
    );
  }
}