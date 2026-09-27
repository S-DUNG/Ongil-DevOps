# IAM
GitHub Actions와 EC2가 사용하는 IAM 사용자, 역할, 정책을 정리합니다.
모든 권한은 **최소 권한 원칙**에 따라 필요한 리소스와 작업으로만 제한했습니다.

> 실제 정책은 AWS 콘솔에 인라인 정책으로 적용되어 있으며 이 폴더의 JSON은 기록용입니다.
> 정책을 변경하면 콘솔과 이 파일을 함께 수정합니다.
> `<ACCOUNT_ID>`, `<INSTANCE_ID>` 등은 실제 값으로 치환해 사용합니다.

## 구성
| 주체 | 종류 | 정책 | 사용처 | 허용 범위 |
|---|---|---|---|---|
| `github-actions-ongil-client` | IAM 사용자 | `github-actions-client-policy.json` | Ongil-Client 레포 CD | `ongil-client` 버킷 업로드/삭제, Client CloudFront 무효화 |
| `github-actions-ongil-admin` | IAM 사용자 | `github-actions-admin-policy.json` | Ongil-Admin 레포 CD | `ongil-admin` 버킷 업로드/삭제, Admin CloudFront 무효화 |
| `github-actions-ongil-server` | IAM 사용자 | `github-actions-server-policy.json` | Ongil-Server 레포 CD | 지정된 EC2 한 대에 `AWS-RunShellScript`로만 명령 전송 |
| `ongil-ec2-ssm-role` | IAM 역할 (EC2) | AWS 관리형 `AmazonSSMManagedInstanceCore` | EC2 인스턴스 | SSM Agent가 명령을 수신하기 위한 권한 |

## 설계 포인트
- **레포별로 IAM 사용자를 분리**했습니다. 한 레포의 액세스 키가 유출되어도 다른 리소스에는 접근할 수 없습니다.
- S3 권한은 대상에 따라 Resource를 나눴습니다.
    - `s3:ListBucket`은 **버킷** 대상 (`arn:aws:s3:::버킷`)
    - `s3:PutObject` 등은 **객체** 대상 (`arn:aws:s3:::버킷/*`)
- 서버 배포는 SSH 대신 **SSM**을 사용해 보안그룹 22번 포트를 GitHub Actions에 열지 않습니다.
- `ssm:GetCommandInvocation`은 AWS가 리소스 단위 제한을 지원하지 않아 `*`로 설정했습니다.

